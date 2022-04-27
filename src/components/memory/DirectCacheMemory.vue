<!--
    Direct cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer"
        :accumulator="accumulator" :addressPointer="addressPointer"/>
    <connector :id="0" :width="3.5" @RegisterConnector="RegisterConnector"/>
    <cache-model :data="cacheData" :tagLength="tagLength" @SwitchValidBit="SwitchValidBit" @RegisterCache="RegisterCache"/>
    <connector :id="1" :width="3.5" @RegisterConnector="RegisterConnector"/>
    <ram-model :data="ramData" @RegisterRam="RegisterRam"/>
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import RamModel from '../model/RamModel.vue';
import CacheModel from '../model/CacheModel.vue';
import Connector from '../model/Connector.vue';

import MemoryUtils from '@/scripts/MemoryUtils.js';
import CacheBlock from '@/scripts/CacheBlock.js';
import Sleep from '@/scripts/Sleep.js';
export default {
    name: "DirectCacheMemory",
    components: { ProcessorModel, RamModel, CacheModel, Connector },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number},
        addressPointer: { type: Number }
    },

    computed: {
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
            return this.cacheData.length * 4;
        }
    },

    data() {
        return {
            ramData: [],
            cacheData: [],
            connectorCpuCache: { fromCpuToMemory: null, fromMemoryToCpu: null },
            connectorCacheMem: { fromCpuToMemory: null, fromMemoryToCpu: null },
            ramModel: { highlight: null },
            cacheModel: { highlight: null },
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

            // Data koherence: valid-bit
            // Memory block is in cache
            this.cycleCounter.value += this.cycleCosts.cacheCheck;
            if (this.cacheData[cacheBlock].tag == cacheTag && !this.cacheData[cacheBlock].isEmpty) {
                await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data);
            }
            // Not in cache
            else {
                // Current memory block valid - can overwrite
                if (this.cacheData[cacheBlock].valid) {
                    await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag);
                    await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data);
                }
                // Current memory block not valid - must save
                else {
                    var ramAddress = this.memoryUtils.getRamAddressFromCache(this.cacheData[cacheBlock].tag, cacheAddress, this.cacheAddressBits);

                    await this.memoryUtils.writeToRam(cacheAddress, ramAddress);
                    await Sleep(this.connectorFadeTime.value / 2);
                    await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag);
                    await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data);
                }
            }
        },
        async Read(address) {
            if (address > this.ramDataLength || address < 0)
                throw RangeError(`Invalid memory address (0x${address.toString(16).toUpperCase()}).`);

            var cacheAddress = address & ((1 << this.cacheAddressBits) - 1);
            var cacheBlock = cacheAddress >> 2;
            var cacheTag = address >> this.cacheAddressBits;

            // Check in cache
            this.cycleCounter.value += this.cycleCosts.cacheCheck;
            if (this.cacheData[cacheBlock].tag == cacheTag && !this.cacheData[cacheBlock].isEmpty) {
                return await this.memoryUtils.readFromCache(cacheAddress);
            }
            // Not in cache
            else {
                // Current memory block valid - can overwrite
                if (this.cacheData[cacheBlock].valid) {
                    await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag);
                    return await this.memoryUtils.readFromCache(cacheAddress);
                }
                // Current memory block not valid - must save
                else {
                    var ramAddress = this.memoryUtils.getRamAddressFromCache(this.cacheData[cacheBlock].tag, cacheAddress, this.cacheAddressBits);

                    await this.memoryUtils.writeToRam(cacheAddress, ramAddress);
                    await Sleep(this.connectorFadeTime.value / 2);
                    await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag);
                    return await this.memoryUtils.readFromCache(cacheAddress);
                }
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                var address = this.memoryUtils.getRamAddressFromCache(this.cacheData[i].tag, i, this.cacheAddressBits - 2);
                this.ramData[address] = [...this.cacheData[i].data];
                this.cacheData[i].valid = true;
            }
        },
        Initialize() {
            this.ramData = Array(this.memorySize.ram);
            for (var i = 0; i < this.memorySize.ram; i++) {
                this.ramData[i] = [0, 0, 0, 0];
            }
            this.cacheData = Array(this.memorySize.cache);
            for (var j = 0; j < this.memorySize.cache; j++) {
                this.cacheData[j] = new CacheBlock();
            }
            this.memoryUtils = new MemoryUtils(this.ramData, this.cacheData, this.ramModel, this.cacheModel, this.connectorCpuCache, this.connectorCacheMem, this);
        },

        SwitchValidBit(row) {
            this.cacheData[row].switchValid();
        },

        RegisterConnector(id, connector) {
            if (id == 0) this.connectorCpuCache = connector;
            else if (id == 1) this.connectorCacheMem = connector;
        },
        RegisterRam(ram) {
            this.ramModel = ram;
        },
        RegisterCache(cache) {
            this.cacheModel = cache;
        }
    }
}
</script>
