<!--
    Two-way cache memory component
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <div class="horizontal-container">
        <cache-model :data="cacheData[0]" />
        <cache-model :data="cacheData[1]" />
    </div>
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import CacheModel from '../model/CacheModel.vue';
import RamModel from '../model/RamModel.vue'
import { ReadRam, GetRamAddressFromCache, UpdateCache } from '@/scripts/MemoryUtils.js';
export default {
    name: "TwoWayCacheMemory",
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
            cacheData: [[{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}], [{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}]]
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

            var cacheAddress = address & 0b01;
            var cacheTag = (address & 0b1110) >> 1;

            // TODO: Data koherence, currently using valid-bit
            // Memory block is in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                if (this.cacheData[i][cacheAddress].tag == cacheTag) {
                    this.cacheData[i][cacheAddress] = UpdateCache(cacheTag, data);
                    return;
                }
            }

            // Not in cache
            // TODO: Selection of victim, currently random
            var id = Math.random() < 0.5 ? 0 : 1;
            // Current memory block valid - can overwrite
            if (this.cacheData[id][cacheAddress].valid) {
                this.cacheData[id][cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                this.cacheData[id][cacheAddress] = UpdateCache(cacheTag, data);
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = GetRamAddressFromCache(cacheAddress, this.cacheData[id][cacheAddress].tag, 1);
                this.ramData[ramAddress] = this.cacheData[id][cacheAddress].data;

                this.cacheData[id][cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                this.cacheData[id][cacheAddress] = UpdateCache(cacheTag, data);
            }
        },
        Read(address) {
            if (address > this.ramData.length || address < 0)
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b1;
            var cacheTag = (address & 0b1110) >> 1;

            // Check in cache
            for (var i = 0; i < this.cacheData.length; i++) {
                if (this.cacheData[i][cacheAddress].tag == cacheTag) {
                    return this.cacheData[i][cacheAddress].data;
                }
            }

            // Not in cache
            // TODO: Selection of victim, currently random
            var id = Math.random() < 0.5 ? 0 : 1;
            // Current memory block valid - can overwrite
            if (this.cacheData[id][cacheAddress].valid) {
                this.cacheData[id][cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                return this.cacheData[id][cacheAddress].data;
            }
            // Current memory block not valid - must save
            else {
                var ramAddress = GetRamAddressFromCache(cacheAddress, this.cacheData[id][cacheAddress].tag, 1);
                this.ramData[ramAddress] = this.cacheData[id][cacheAddress].data

                this.cacheData[id][cacheAddress] = ReadRam(cacheTag, this.ramData[address]);
                return this.cacheData[id][cacheAddress].data;
            }
        },
        Flush() {
            for (var i = 0; i < this.cacheData.length; i++) {
                for (var j = 0; j < this.cacheData[i].length; j++) {
                    var address = GetRamAddressFromCache(j, this.cacheData[i][j].tag, 1);
                    this.ramData[address] = this.cacheData[i][j].data;
                    this.cacheData[i][j].valid = true;
                }
            }
        },
        Reset() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.cacheData = [[{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}], [{valid: true, tag: 0, data: 0}, {valid: true, tag: 0, data: 0}]]
        }
    }
}
</script>