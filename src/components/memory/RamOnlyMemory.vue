<!--
    RAM-only memory component, contains no cache
    Primarily for reference and testing purposes
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer"
        :accumulator="accumulator" :addressPointer="addressPointer"/>
    <connector :id="0" :width="6" @RegisterConnector="RegisterConnector"/>
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
        accumulator: { type: Number},
        addressPointer: { type: Number }
    },

    data() {
        return {
            ramData: [],
            connector: { fromCpuToMemory: null, fromMemoryToCpu: null },
            ramModel: { highlight: null }
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: () => {}, initialize: this.Initialize });
        this.Initialize();
    },

    methods: {
        async Write(address, data) {
            if (address < this.ramData.length && address >= 0)
            {
                await this.connector.fromCpuToMemory(this.connectorFillTime.value, this.connectorFadeTime.value);
                this.ramModel.highlight(address, this.highlightFadeTime.value);
                this.cycleCounter.value += this.cycleCosts.ramAccess;
                this.ramData[address] = data;
            }
            else throw RangeError(`Invalid memory address (${address}).`);
        },
        async Read(address) {
            if (address < this.ramData.length && address >= 0)
            {
                this.cycleCounter.value += this.cycleCosts.ramAccess;
                this.ramModel.highlight(address, this.highlightFadeTime.value);
                await this.connector.fromMemoryToCpu(this.connectorFillTime.value, this.connectorFadeTime.value);
                return this.ramData[address];
            }
            else throw RangeError(`Invalid memory address (${address}).`);
        },
        Initialize() {
            this.ramData = Array(this.memorySize.ram);
            for (var i = 0; i < this.memorySize.ram; i++) {
                this.ramData[i] = 0;
            }
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
