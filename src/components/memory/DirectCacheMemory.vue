<!--
    Direct cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <connector :id="0" :width="4" @RegisterConnector="RegisterConnector"/>
    <cache-model :data="cacheData" />
    <connector :id="1" :width="4" @RegisterConnector="RegisterConnector"/>
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import RamModel from '../model/RamModel.vue';
import CacheModel from '../model/CacheModel.vue';
import Connector from '../model/Connector.vue';

import { ReadFromRam, WriteToRam, ReadFromCache, WriteToCache, GetRamAddressFromCache } from '@/scripts/MemoryUtils.js';
import Sleep from '@/scripts/Sleep.js';
import CacheBlock from '@/scripts/CacheBlock.js';
export default {
    name: "DirectCacheMemory",
    components: { ProcessorModel, RamModel, CacheModel, Connector },
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
            connectorCacheMem: { fromCpuToMemory: null, fromMemoryToCpu: null }
        }
    },

    created() {
        this.Reset();
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: this.Flush, reset: this.Reset });
    },

    methods: {
        async Write(address, data) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b11;
            var cacheTag = (address & 0b1100) >> 2;

            // Data koherence: valid-bit
            // Memory block is in cache
            if (this.cacheData[cacheAddress].tag == cacheTag) {
                await WriteToCache(this.cacheData[cacheAddress], cacheTag, data, this.connectorCpuCache, this);
            }
            // Not in cache
            else {
                // Current memory block valid - can overwrite
                if (this.cacheData[cacheAddress].valid) {
                    await ReadFromRam(this.cacheData[cacheAddress], cacheTag, this.ramData[address], this.connectorCacheMem, this);
                    await WriteToCache(this.cacheData[cacheAddress], cacheTag, data, this.connectorCpuCache, this);
                }
                // Current memory block not valid - must save
                else {
                    var ramAddress = GetRamAddressFromCache(cacheAddress, this.cacheData[cacheAddress].tag, 2);

                    await WriteToRam(this.cacheData[cacheAddress], this.ramData, ramAddress, this.connectorCacheMem, this)
                    await Sleep(this.connectorFadeTime);
                    await ReadFromRam(this.cacheData[cacheAddress], cacheTag, this.ramData[address], this.connectorCacheMem, this)
                    await WriteToCache(this.cacheData[cacheAddress], cacheTag, data, this.connectorCpuCache, this);
                }
            }
        },
        async Read(address) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b11;
            var cacheTag = (address & 0b1100) >> 2;

            // Check in cache
            if (this.cacheData[cacheAddress].tag == cacheTag) {
                return await ReadFromCache(this.cacheData[cacheAddress], this.connectorCpuCache, this);
            }
            // Not in cache
            else {
                // Current memory block valid - can overwrite
                if (this.cacheData[cacheAddress].valid) {
                    await ReadFromRam(this.cacheData[cacheAddress], cacheTag, this.ramData[address], this.connectorCacheMem)
                    return await ReadFromCache(this.cacheData[cacheAddress], this.connectorCpuCache, this);
                }
                // Current memory block not valid - must save
                else {
                    var ramAddress = GetRamAddressFromCache(cacheAddress, this.cacheData[cacheAddress].tag, 2);

                    await WriteToRam(this.cacheData[cacheAddress], this.ramData, ramAddress, this.connectorCacheMem)
                    await Sleep(this.connectorFadeTime);
                    await ReadFromRam(this.cacheData[cacheAddress], cacheTag, this.ramData[address], this.connectorCacheMem, this)
                    return await ReadFromCache(this.cacheData[cacheAddress], this.connectorCpuCache, this);
                }
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                var address = GetRamAddressFromCache(i, this.cacheData[i].tag, 2);
                this.ramData[address] = this.cacheData[i].data;
                this.cacheData[i].valid = true;
            }
        },
        Reset() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.cacheData = [new CacheBlock(), new CacheBlock(), new CacheBlock(), new CacheBlock()];
        },
        RegisterConnector(id, connector) {
            if (id == 0)
                this.connectorCpuCache = connector;
            else if (id == 1)
                this.connectorCacheMem = connector;
        }
    }
}
</script>
