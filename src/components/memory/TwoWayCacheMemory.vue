<!--
    Two-way cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer"
        :accumulator="accumulator" :addressPointer="addressPointer" @RegisterRegs="(e) => $emit('RegisterRegs', e)"/>
    <div class="vertical-container">
        <connector :id="0" :width="3.5" @RegisterConnector="RegisterConnector"/>
        <connector :id="2" :width="3.5" @RegisterConnector="RegisterConnector"/>
    </div>
    <div class="vertical-container">
        <cache-model :id="0" :data="cacheData[0]" :tagLength="tagLength" @SwitchValidBit="SwitchValidBit" @RegisterCache="RegisterCache"/>
        <cache-model :id="1" :data="cacheData[1]" :tagLength="tagLength" @SwitchValidBit="SwitchValidBit" @RegisterCache="RegisterCache"/>
    </div>
    <div class="vertical-container">
        <connector :id="1" :width="3.5" @RegisterConnector="RegisterConnector"/>
        <connector :id="3" :width="3.5" @RegisterConnector="RegisterConnector"/>
    </div>
    <ram-model :data="ramData" @RegisterRam="RegisterRam"/>
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import CacheModel from '../model/CacheModel.vue';
import RamModel from '../model/RamModel.vue';
import Connector from '../model/Connector.vue';

import MemoryUtils from '@/scripts/MemoryUtils.js';
import CacheBlock from '@/scripts/CacheBlock.js';
import Sleep from '@/scripts/Sleep.js';
export default {
    name: "TwoWayCacheMemory",
    components: { ProcessorModel, CacheModel, RamModel, Connector },
    emits: ["RegisterMemory", "RegisterRegs"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number},
        addressPointer: { type: Number }
    },

    computed: {
        // TODO: Check and rename to be clearer
        tagLength() {
            return Math.floor(Math.log2(this.ramDataLength + 1)) - Math.floor(Math.log2(this.cacheDataLength + 1));
        },
        cacheAddressBits() {
            return Math.floor(Math.log2(this.cacheDataLength + 1));
        },
        ramDataLength() {
            return this.ramData.length * 4;
        },
        cacheDataLength() {
            return this.cacheData[0].length * 4;
        }
    },

    data() {
        return {
            ramData: [],
            cacheData: [[], []],
            connectorCpuCache: [],
            connectorCacheMem: [],
            cacheModel: [],
            ramModel: { highlight: null, highlightTag: null },
            memoryUtils: null
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: this.Flush, initialize: this.Initialize });
        this.Initialize();
    },

    methods: {
        async Write(address, data) {
            if (address > this.ramDataLength || address < 0)
                throw RangeError(`Invalid memory address (0x${address.toString(16).toUpperCase()}).`);

            var cacheAddress = address & ((1 << this.cacheAddressBits) - 1);
            var cacheBlock = cacheAddress >> 2;
            var cacheTag = address >> this.cacheAddressBits;

            this.cacheStats.memoryAccesses++;

            // Data koherence: valid-bit
            // Memory block is in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                this.cacheStats.cycles += this.cycleCosts.cacheCheck;
                await this.cacheModel[i].highlightTag(cacheBlock, Math.min(this.times.highlightFade / 2, 500));
                if (this.cacheData[i][cacheBlock].tag == cacheTag  && !this.cacheData[i][cacheBlock].isEmpty) {
                    this.cacheStats.cacheHits++;
                    await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data, i);
                    return;
                }
            }

            // Not in cache
            this.cacheStats.cacheMisses++;
            // Selection of victim: check if unused, then random
            var id = null;
            for (var j = 0; j < this.cacheData.length; j++) {
                if (this.cacheData[j][cacheBlock].isEmpty) {
                    id = j;
                    break;
                }
            }
            if (id == null) {
                id = Math.floor(Math.random() * this.cacheData.length);
            }

            // Current memory block valid - can overwrite
            if (this.cacheData[id][cacheBlock].valid) {
                await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag, id);
                await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data, id);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = this.memoryUtils.getRamAddressFromCache(this.cacheData[id][cacheBlock].tag, cacheAddress, this.cacheAddressBits);
                
                await this.memoryUtils.writeToRam(cacheAddress, ramAddress, id);
                await Sleep(this.times.connectorFade / 2);
                await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag, id);
                await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data, id);
            }
        },
        async Read(address) {
            if (address > this.ramDataLength || address < 0)
                throw RangeError(`Invalid memory address (0x${address.toString(16).toUpperCase()}).`);

            var cacheAddress = address & ((1 << this.cacheAddressBits) - 1);
            var cacheBlock = cacheAddress >> 2;
            var cacheTag = address >> this.cacheAddressBits;

            this.cacheStats.memoryAccesses++;

            // Check in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                this.cacheStats.cycles += this.cycleCosts.cacheCheck;
                await this.cacheModel[i].highlightTag(cacheBlock, Math.min(this.times.highlightFade / 2, 500));
                if (this.cacheData[i][cacheBlock].tag == cacheTag && !this.cacheData[i][cacheBlock].isEmpty) {
                    this.cacheStats.cacheHits++;
                    return await this.memoryUtils.readFromCache(cacheAddress, i);
                }
            }

            // Not in cache
            this.cacheStats.cacheMisses++;
            // Selection of victim: check if unused, then random
            var id = null;
            for (var j = 0; j < this.cacheData.length; j++) {
                if (this.cacheData[j][cacheBlock].isEmpty) {
                    id = j;
                    break;
                }
            }
            if (id == null) {
                id = Math.floor(Math.random() * this.cacheData.length);
            }

            // Current memory block valid - can overwrite
            if (this.cacheData[id][cacheBlock].valid) {
                await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag, id);
                return await this.memoryUtils.readFromCache(cacheAddress, id);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = this.memoryUtils.getRamAddressFromCache(this.cacheData[id][cacheBlock].tag, cacheAddress, this.cacheAddressBits);
                
                await this.memoryUtils.writeToRam(cacheAddress, ramAddress, id);
                await Sleep(this.times.connectorFade / 2);
                await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag, id);
                return await this.memoryUtils.readFromCache(cacheAddress, id);
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                for (var j = 0; j < this.cacheData[i].length; j++) {
                    var address = this.memoryUtils.getRamAddressFromCache(this.cacheData[i][j].tag, j, this.cacheAddressBits - 2);
                    if (!this.cacheData[i][j].isEmpty)
                    {
                        this.ramData[address] = [...this.cacheData[i][j].data];
                        this.cacheData[i][j] = new CacheBlock();
                    }
                }
            }
        },
        Initialize() {
            this.ramData = Array(this.memorySize.ram);
            for (var i = 0; i < this.memorySize.ram; i++) {
                this.ramData[i] = [0, 0, 0, 0];
            }
            this.cacheData[0] = Array(Math.floor(this.memorySize.cache / 2));
            this.cacheData[1] = Array(Math.floor(this.memorySize.cache / 2));
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < this.memorySize.cache / 2; k++) {
                    this.cacheData[j][k] = new CacheBlock();
                }
            }
            this.memoryUtils = new MemoryUtils(this.ramData, this.cacheData, this.ramModel, this.cacheModel, this.connectorCpuCache, this.connectorCacheMem, this);
        },

        SwitchValidBit(row, id) {
            this.cacheData[id][row].switchValid();
        },

        RegisterConnector(id, connector) {
            if (id % 2 == 0) this.connectorCpuCache[Math.floor(id / 2)] = connector;
            else if (id % 2 == 1) this.connectorCacheMem[Math.floor(id / 2)] = connector;
        },
        RegisterRam(ram) {
            this.ramModel = ram;
        },
        RegisterCache(cache, id) {
            this.cacheModel[id] = cache;
        }
    }
}
</script>
