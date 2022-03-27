<!--
    Fully associative cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <connector :id="0" :width="4" @RegisterConnector="RegisterConnector"/>
    <cache-model :data="cacheData" @RegisterCache="RegisterCache"/>
    <connector :id="1" :width="4" @RegisterConnector="RegisterConnector"/>
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
    name: "FullCacheMemory",
    components: { ProcessorModel, CacheModel, RamModel, Connector },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number}
    },

    data() {
        return {
            ramData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cacheData: [new CacheBlock(), new CacheBlock(), new CacheBlock(), new CacheBlock()],
            connectorCpuCache: { fromCpuToMemory: null, fromMemoryToCpu: null },
            connectorCacheMem: { fromCpuToMemory: null, fromMemoryToCpu: null },
            ramModel: { highlight: null },
            cacheModel: { highlight: null },
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

            // Data koherence: valid-bit
            // Memory block is in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                this.cycleCounter.value += this.cycleCosts.cacheCheck;
                if (this.cacheData[i].tag == address) {
                    await this.memoryUtils.writeToCache(i, address, data);
                    return;
                }
            }

            // Not in cache
            // Selection of victim: random
            var id = Math.floor(Math.random() * 4);
            // Current memory block valid - can overwrite
            if (this.cacheData[id].valid) {
                await this.memoryUtils.readFromRam(id, address, address);
                await this.memoryUtils.writeToCache(id, address, data);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = this.cacheData[id].tag;

                await this.memoryUtils.writeToRam(id, ramAddress);
                await this.memoryUtils.readFromRam(id, address, address);
                await this.memoryUtils.writeToCache(id, address, data);
            }
        },
        async Read(address) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            // Check in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                this.cycleCounter.value += this.cycleCosts.cacheCheck;
                if (this.cacheData[i].tag == address) {
                    return await this.memoryUtils.readFromCache(i);
                }
            }

            // Not in cache
            // Selection of victim: random
            var id = Math.floor(Math.random() * 4);
            // Current memory block valid - can ovewrite
            if (this.cacheData[id].valid) {
                await this.memoryUtils.readFromRam(id, address, address);
                return await this.memoryUtils.readFromCache(id);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = this.cacheData[id].tag;

                await this.memoryUtils.writeToRam(id, ramAddress);
                await this.memoryUtils.readFromRam(id, address, address);
                return await this.memoryUtils.readFromCache(id);
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                this.ramData[this.cacheData[i].tag] = this.cacheData[i].data;
                this.cacheData[i].valid = true;
            }
        },
        Initialize() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.cacheData = [new CacheBlock(), new CacheBlock(), new CacheBlock(), new CacheBlock()];
            this.memoryUtils = new MemoryUtils(this.ramData, this.cacheData, this.ramModel, this.cacheModel, this.connectorCpuCache, this.connectorCacheMem, this);
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