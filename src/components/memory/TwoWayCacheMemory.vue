<!--
    Two-way cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <div class="vertical-container">
        <connector :id="0" :width="4" @RegisterConnector="RegisterConnector"/>
        <connector :id="2" :width="4" @RegisterConnector="RegisterConnector"/>
    </div>
    <div class="vertical-container">
        <cache-model :id="0" :data="cacheData[0]" :tagLength="tagLength" @RegisterCache="RegisterCache"/>
        <cache-model :id="1" :data="cacheData[1]" :tagLength="tagLength" @RegisterCache="RegisterCache"/>
    </div>
    <div class="vertical-container">
        <connector :id="1" :width="4" @RegisterConnector="RegisterConnector"/>
        <connector :id="3" :width="4" @RegisterConnector="RegisterConnector"/>
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
export default {
    name: "TwoWayCacheMemory",
    components: { ProcessorModel, CacheModel, RamModel, Connector },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number}
    },

    computed: {
        tagLength() {
            return Math.floor(Math.log2(this.ramData.length + 1)) - Math.floor(Math.log2(this.cacheData.length + 1));
        }
    },

    data() {
        return {
            ramData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cacheData: [[new CacheBlock(), new CacheBlock()], [new CacheBlock(), new CacheBlock()]],
            connectorCpuCache: [],
            connectorCacheMem: [],
            cacheModel: [],
            ramModel: { highlight: null },
            memoryUtils: null
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: this.Flush, initialize: this.Initialize });
    },

    methods: {
        async Write(address, data) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b01;
            var cacheTag = (address & 0b1110) >> 1;

            // Data koherence: valid-bit
            // Memory block is in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                this.cycleCounter.value += this.cycleCosts.cacheCheck;
                if (this.cacheData[i][cacheAddress].tag == cacheTag) {
                    await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data, i);
                    return;
                }
            }

            // Not in cache
            // Selection of victim: check if unused, then random
            var id = null;
            for (var j = 0; j < this.cacheData.length; j++) {
                if (this.cacheData[j][cacheAddress].isEmpty) {
                    id = j;
                    break;
                }
            }
            if (id == null) {
                id = Math.floor(Math.random() * 2);
            }

            // Current memory block valid - can overwrite
            if (this.cacheData[id][cacheAddress].valid) {
                await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data, id);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = this.memoryUtils.getRamAddressFromCache(cacheAddress, this.cacheData[id][cacheAddress].tag, 1);
                
                await this.memoryUtils.writeToRam(cacheAddress, ramAddress, id);
                await this.memoryUtils.writeToCache(cacheAddress, cacheTag, data, id);
            }
        },
        async Read(address) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b1;
            var cacheTag = (address & 0b1110) >> 1;

            // Check in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                this.cycleCounter.value += this.cycleCosts.cacheCheck;
                if (this.cacheData[i][cacheAddress].tag == cacheTag) {
                    return await this.memoryUtils.readFromCache(cacheAddress, i);
                }
            }

            // Not in cache
            // Selection of victim: check if unused, then random
            var id = null;
            for (var j = 0; j < this.cacheData.length; j++) {
                if (this.cacheData[j][cacheAddress].isEmpty) {
                    id = j;
                    break;
                }
            }
            if (id == null) {
                id = Math.floor(Math.random() * 2);
            }

            // Current memory block valid - can overwrite
            if (this.cacheData[id][cacheAddress].valid) {
                await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag, id);
                return await this.memoryUtils.readFromCache(cacheAddress, id);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = this.memoryUtils.getRamAddressFromCache(cacheAddress, this.cacheData[id][cacheAddress].tag, 1);
                
                await this.memoryUtils.writeToRam(cacheAddress, ramAddress, id);
                await this.memoryUtils.readFromRam(cacheAddress, address, cacheTag, id);
                return await this.memoryUtils.readFromCache(cacheAddress, id);
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                for (var j = 0; j < this.cacheData[i].length; j++) {
                    var address = this.memoryUtils.getRamAddressFromCache(j, this.cacheData[i][j].tag, 1);
                    this.ramData[address] = this.cacheData[i][j].data;
                    this.cacheData[i][j].valid = true;
                }
            }
        },
        Initialize() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.cacheData = [[new CacheBlock(), new CacheBlock()], [new CacheBlock(), new CacheBlock()]];
            this.memoryUtils = new MemoryUtils(this.ramData, this.cacheData, this.ramModel, this.cacheModel, this.connectorCpuCache, this.connectorCacheMem, this);
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
