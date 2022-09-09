<!--
    RAM-only memory component, contains no cache
    Primarily for reference and testing purposes
!-->

<template>
    <processor-model :instruction="instruction" :instuctionPointer="instructionPointer"
        :accumulator="accumulator" :addressPointer="addressPointer" @RegisterRegs="(e) => $emit('RegisterRegs', e)"/>
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
    emits: ["RegisterMemory", "RegisterRegs"],

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

    computed: {
        ramDataLength() {
            return this.ramData.length * 4;
        }
    },

    created() {
        this.$emit("RegisterMemory", { write: this.Write, read: this.Read, flush: () => {}, initialize: this.Initialize });
        this.Initialize();
    },

    methods: {
        async Write(address, data) {
            if (address < this.ramDataLength && address >= 0)
            {
                var block = address >> 2;
                var offset = address & 0b11;

                await this.connector.fromCpuToMemory();
                this.ramModel.highlight(address);
                this.cacheStats.cycles += this.cycleCosts.ramAccess;
                this.ramData[block][offset] = data;
            }
            else throw RangeError(`Invalid memory address (0x${address.toString(16).toUpperCase()}).`);
        },
        async Read(address) {
            if (address < this.ramDataLength && address >= 0)
            {
                var block = address >> 2;
                var offset = address & 0b11;

                this.cacheStats.cycles += this.cycleCosts.ramAccess;
                this.ramModel.highlight(address);
                await this.connector.fromMemoryToCpu();
                return this.ramData[block][offset];
            }
            else throw RangeError(`Invalid memory address (0x${address.toString(16).toUpperCase()}).`);
        },
        Initialize() {
            this.ramData = Array(this.memorySize.ram);
            for (var i = 0; i < this.memorySize.ram; i++) {
                this.ramData[i] = [0, 0, 0, 0];
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
