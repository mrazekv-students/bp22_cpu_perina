<!--
    RAM-only memory component, contains no cache
    Primarily for reference and testing purposes
!-->

<template>
    <processor-model />
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue'
import RamModel from '../model/RamModel.vue';
export default {
    name: "RamOnlyMemory",
    components: { ProcessorModel, RamModel },
    emits: ["RegisterMemory"],

    data() {
        return {
            ramData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, reset: this.Reset });
    },

    methods: {
        Write(address, data) {
            if (address < this.ramData.length)
                this.ramData[address] = data;
            else throw RangeError("Invalid memory address")
        },
        Read(address) {
            if (address < this.ramData.length)
                return this.ramData[address];
            else throw RangeError("Invalid memory address")
        },
        Reset() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }
}
</script>