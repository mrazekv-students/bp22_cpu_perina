<!--
    Fully associative cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <cache-model :data="cacheData" />
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import CacheModel from '../model/CacheModel.vue';
import RamModel from '../model/RamModel.vue'
import { ReadRam, UpdateCache } from '@/scripts/MemoryUtils.js';
export default {
    name: "FullCacheMemory",
    components: { ProcessorModel, CacheModel, RamModel },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number}
    },

    data() {
        return {
            ramData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cacheData: [{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}]
        }
    },

    created() {
        this.Reset();
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: this.Flush, reset: this.Reset });
    },

    methods: {
        Write(address, data) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            // TODO: Data koherence, currently using valid-bit
            // Memory block is in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                if (this.cacheData[i].tag == address) {
                    this.cacheData[i] = UpdateCache(address, data);
                    return;
                }
            }

            // Not in cache
            // TODO: Selection of victim, currently random
            var id = Math.floor(Math.random() * 4);
            // Current memory block valid - can overwrite
            if (this.cacheData[id].valid) {
                this.cacheData[id] = ReadRam(address, this.ramData[address]);
                this.cacheData[id] = UpdateCache(address, data);
            }
            // Current memory block not valid - must save
            else {
                this.ramData[this.cacheData[id].tag] = this.cacheData[id].data;

                this.cacheData[id] = ReadRam(address, this.ramData[address]);
                this.cacheData[id] = UpdateCache(address, data);
            }
        },
        Read(address) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            // Check in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                if (this.cacheData[i].tag == address) {
                    return this.cacheData[i].data;
                }
            }

            // Not in cache
            // TODO: Selection of victim, currently random
            var id = Math.floor(Math.random() * 4);
            // Current memory block valid - can ovewrite
            if (this.cacheData[id].valid) {
                this.cacheData[id] = ReadRam(address, this.ramData[address]);
                return this.cacheData[id].data;
            }
            // Current memory block not valid - must save
            else {
                this.ramData[this.cacheData[id].tag] = this.cacheData[id].data;

                this.cacheData[id] = ReadRam(address, this.ramData[address]);
                return this.cacheData[id].data;
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                this.ramData[this.cacheData[i].tag] = this.cacheData[i].data;
                this.cacheData[i].valid = true;
            }
        },
        Reset() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.cacheData = [{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}];
        }
    }
}
</script>