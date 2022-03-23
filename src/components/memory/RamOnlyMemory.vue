<!--
    RAM-only memory component, contains no cache
    Primarily for reference and testing purposes
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <connector :id="0" @RegisterConnector="RegisterConnector"/>
    <ram-model :data="ramData" />
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import RamModel from '../model/RamModel.vue';
import Connector from '../model/Connector.vue'
export default {
    name: "RamOnlyMemory",
    components: { ProcessorModel, RamModel, Connector },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number}
    },

    data() {
        return {
            ramData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            connector: { fromCpuToMemory: null, fromMemoryToCpu: null }
        }
    },

    created() {
        this.Reset();
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: () => {}, reset: this.Reset });
    },

    methods: {
        Write(address, data) {
            this.connector.fromCpuToMemory(500);
            if (address < this.ramData.length && address >= 0)
                this.ramData[address] = data;
            else throw RangeError("Invalid memory address")
        },
        Read(address) {
            this.connector.fromMemoryToCpu(500);
            if (address < this.ramData.length && address >= 0)
                return this.ramData[address];
            else throw RangeError("Invalid memory address")
        },
        Reset() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        },

        RegisterConnector(id, connector) {
            this.connector = connector;
        }
    }
}
</script>
