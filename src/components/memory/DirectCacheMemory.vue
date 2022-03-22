<!--
    Direct cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <cache-model :data="cacheData" />
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import RamModel from '../model/RamModel.vue';
import CacheModel from '../model/CacheModel.vue';
import { ReadRam, GetRamAddressFromCache, UpdateCache } from '@/scripts/MemoryUtils.js';
export default {
    name: "DirectCacheMemory",
    components: { ProcessorModel, RamModel, CacheModel },
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

            var cacheAddress = address & 0b11;
            var cacheTag = (address & 0b1100) >> 2;

            // TODO: Data koherence, currently using valid-bit
            // Memory block is in cache
            if (this.cacheData[cacheAddress].tag == cacheTag) {
                this.cacheData[cacheAddress] = UpdateCache(cacheTag, data);
            }
            // Not in cache
            else {
                // Current memory block valid - can overwrite
                if (this.cacheData[cacheAddress].valid) {
                    this.cacheData[cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                    this.cacheData[cacheAddress] = UpdateCache(cacheTag, data);
                }
                // Current memory block not valid - must save
                else {
                    var ramAddress = GetRamAddressFromCache(cacheAddress, this.cacheData[cacheAddress].tag, 2);
                    this.ramData[ramAddress] = this.cacheData[cacheAddress].data;

                    this.cacheData[cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                    this.cacheData[cacheAddress] = UpdateCache(cacheTag, data);
                }
            }
        },
        Read(address) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b11;
            var cacheTag = (address & 0b1100) >> 2;

            // Check in cache
            if (this.cacheData[cacheAddress].tag == cacheTag) {
                return this.cacheData[cacheAddress].data;
            }
            // Not in cache
            else {
                // Current memory block valid - can overwrite
                if (this.cacheData[cacheAddress].valid) {
                    this.cacheData[cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                    return this.cacheData[cacheAddress].data;
                }
                // Current memory block not valid - must save
                else {
                    var ramAddress = GetRamAddressFromCache(cacheAddress, this.cacheData[cacheAddress].tag, 2);
                    this.ramData[ramAddress] = this.cacheData[cacheAddress].data;

                    this.cacheData[cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                    return this.cacheData[cacheAddress].data;
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
            this.cacheData = [{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}];
        }
    }
}
</script>
