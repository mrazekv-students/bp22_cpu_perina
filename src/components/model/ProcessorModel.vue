<!--
    Visual only component for processor
    TODO: Label highlight
!-->

<template>
    <div class="vertical-container processor">
        <span class="title">CPU</span>
        <register-label :value="instruction" class="current-instruction"/>
        <div class="horizontal-container registers">
            <register-label label="IP" :tooltip="tooltips.regIP"
                :value="instuctionPointer"/>
            <register-label label="ACC" :tooltip="tooltips.regACC"
                :value="accumulator" @RegisterLabel="RegisterACC"/>
        </div>
        <register-label label="AP" :tooltip="tooltips.regAP"
            :value="addressPointerString" @RegisterLabel="RegisterAP" class="address-pointer"/>
        
        <cache-stats :cycles="0" :memoryAccesses="0" :cacheHits="0" :cacheMisses="0"/>
    </div>
</template>

<script>
import RegisterLabel from './RegisterLabel.vue'
import CacheStats from './CacheStats.vue'
export default {
    name: "ProcessorModel",
    components: { RegisterLabel, CacheStats },
    emits: ["RegisterRegs"],

    props: {
        instruction: { type: String },
        instuctionPointer: { type: Number },
        accumulator: { type: Number },
        addressPointer: { type: Number, default: 0 }
    },
    computed: {
        addressPointerString() {
            // Source: https://stackoverflow.com/questions/42368797/how-can-i-convert-an-integer-to-hex-with-a-fix-length-in-javascript
            return `0x${this.addressPointer.toString(16).toUpperCase()}`
        }
    },

    data() {
        return {
            registers: { highlightACC: null, highlightAP: null },
            tooltips: {
                regIP: { content: "<h4>Instruction pointer register</h4>Register containing address of next instruction", html: true },
                regACC: { content: "<h4>Accumulator register</h4>Register for program data", html: true },
                regAP: { content: "<h4>Address pointer register</h4>Register with memory address used during memory accesses", html: true },
            }
        }
    },

    methods: {
        RegisterACC(acc) {
            this.registers.highlightACC = acc.highlight;
            this.$emit("RegisterRegs", this.registers);
        },
        RegisterAP(ap) {
            this.registers.highlightAP = ap.highlight;
            this.$emit("RegisterRegs", this.registers);
        }
    }
}
</script>

<style>
.processor {
    align-items: center;
    width: 16rem;
    height: auto;
    padding: 0.5rem 1rem;

    border: solid 10px var(--mainColor);
    border-left-width: 2px;
    border-right-width: 2px;
    border-radius: 10px;
    background: var(--mainColorDark);
}
.processor>.title {
    font-size: 2.5rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}
.processor>.registers {
    width: 100%;
    margin-top: 0.5rem;
    justify-content: space-between;
}

.processor>.current-instruction>.value {
    min-width: 6em;
    text-align: center;
}

.processor>.address-pointer {
    margin-left: auto;
    margin-top: 0.3rem;
}
.processor>.address-pointer>.value {
    min-width: 6rem;
}
</style>