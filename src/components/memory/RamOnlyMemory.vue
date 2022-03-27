<!--
    RAM-only memory component, contains no cache
    Primarily for reference and testing purposes
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer" :accumulator="accumulator"/>
    <connector :id="0" :width="4" @RegisterConnector="RegisterConnector"/>
    <ram-model :data="ramData" @RegisterRam="RegisterRam"/>
</template>

<script>
import ProcessorModel from '../model/ProcessorModel.vue';
import RamModel from '../model/RamModel.vue';
import Connector from '../model/Connector.vue';
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
            connector: { fromCpuToMemory: null, fromMemoryToCpu: null },
            ramModel: { highlight: null }
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: () => {}, initialize: this.Initialize });
    },

    methods: {
        async Write(address, data) {
            if (address < this.ramData.length && address >= 0)
            {
                await this.connector.fromCpuToMemory(this.connectorFillTime, this.connectorFadeTime);
                this.ramModel.highlight(address, this.highlightFadeTime);
                this.ramData[address] = data;
            }
            else throw RangeError("Invalid memory address")
        },
        async Read(address) {
            if (address < this.ramData.length && address >= 0)
            {
                this.ramModel.highlight(address, this.highlightFadeTime);
                await this.connector.fromMemoryToCpu(this.connectorFillTime, this.connectorFadeTime);
                return this.ramData[address];
            }
            else throw RangeError("Invalid memory address")
        },
        Initialize() {
            this.ramData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        },

        RegisterConnector(id, connector) {
            this.connector = connector;
        },
        RegisterRam(ram) {
            this.ramModel = ram;
        }
    }
}
</script>
