<!--
    RAM-only memory component, contains no cache
    Primarily for reference and testing purposes
!-->

<template>
    <ram-model :data="ramData" />
</template>

<script>
import RamModel from '../model/RamModel.vue';
export default {
    name: "RamOnlyMemory",
    components: { RamModel },

    data() {
        return {
            ramData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read });
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
        }
    }
}
</script>
