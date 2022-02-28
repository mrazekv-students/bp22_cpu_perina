<!--
    Direct cache memory component
!-->

<template>
    <processor-model :currentInstruction="instruction"/>
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import RamModel from '../model/RamModel.vue';
export default {
    name: "DirectCacheMemory",
    components: { ProcessorModel, RamModel },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String }
    },

    data() {
        return {
            ramData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cacheData: [{valid: false, tag: 0, data: 0}, {valid: false, tag: 0, data: 0}, {valid: false, tag: 0, data: 0}, {valid: false, tag: 0, data: 0}]
        }
    },

    created() {
        this.Reset();
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, reset: this.Reset });
    },

    methods: {
        // TODO: Data koherence, currenty write-through (not using valid bit)
        Write(address, data) {
            if (!(address < this.ramData.length && address >= 0))
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b11;
            var cacheTag = (address & 0b1100) >> 2;

            if (this.cacheData[cacheAddress].tag == cacheTag) {
                this.cacheData[cacheAddress].data = data;
                this.ramData[address] = data;
            }
            else {
                // TODO: Needs to be checked
                this.cacheData[cacheAddress] = { valid: true, tag: cacheTag, data: this.ramData[address] };
                this.cacheData[cacheAddress].data = data;
                this.ramData[address] = data;
            }
        },
        Read(address) {
            if (!(address < this.ramData.length && address >= 0))
                throw RangeError("Invalid memory address");

            var cacheAddress = address & 0b11;
            var cacheTag = (address & 0b1100) >> 2;

            if (this.cacheData[cacheAddress].tag == cacheTag) {
                return this.cacheData[cacheAddress];
            }
            else {
                this.cacheData[cacheAddress] = { valid: true, tag: cacheTag, data: this.ramData[address] };
                return this.cacheData[cacheAddress];
            }
        },
        Reset() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.cacheData = [{valid: false, tag: 0, data: 0}, {valid: false, tag: 0, data: 0}, {valid: false, tag: 0, data: 0}, {valid: false, tag: 0, data: 0}];
        }
    }
}
</script>
