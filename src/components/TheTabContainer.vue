<!--
    A tab container component
!-->

<template>
    <div class="horizontal-container tab-button-row">
        <tab-button :displayValue="'RAM-Only Memory'" :disabled="hasStarted" :active="activeTab['RamOnlyMemory']" :function="() => ChangeCurrentTab('RamOnlyMemory')"/>
        <tab-button :displayValue="'Direct Cache'" :disabled="hasStarted" :active="activeTab['DirectCacheMemory']" :function="() => ChangeCurrentTab('DirectCacheMemory')"/>
        <tab-button :displayValue="'Two-Way Cache'" :disabled="hasStarted" :active="activeTab['TwoWayCacheMemory']" :function="() => ChangeCurrentTab('TwoWayCacheMemory')"/>
        <tab-button :displayValue="'Full Cache'" :disabled="hasStarted" :active="activeTab['FullCacheMemory']" :function="() => ChangeCurrentTab('FullCacheMemory')"/>
        <cycle-counter :cycles="this.cycleCounter.value"/>
    </div>
    <div class="horizontal-container tab-container">
        <component :is="currentTab" @RegisterMemory="(e) => $emit('RegisterMemory', e)" @RegisterRegs="(e) => $emit('RegisterRegs', e)"
            :instruction="instruction" :instructionPointer="instructionPointer"
            :accumulator="accumulator" :addressPointer="addressPointer"/>
    </div>
</template>

<script>
import TabButton from './common/TabButton.vue';
import CycleCounter from './model/CycleCounter.vue';
import RamOnlyMemory from './memory/RamOnlyMemory.vue';
import DirectCacheMemory from './memory/DirectCacheMemory.vue';
import TwoWayCacheMemory from './memory/TwoWayCacheMemory.vue';
import FullCacheMemory from './memory/FullCacheMemory.vue'
export default {
    name: "TheTabContainer",
    components: { TabButton, CycleCounter, RamOnlyMemory, DirectCacheMemory, TwoWayCacheMemory, FullCacheMemory },
    emits: ["RegisterMemory", "RegisterRegs"],

    props: {
        instruction: { type: String },
        instructionPointer: { type: Number },
        accumulator: { type: Number},
        addressPointer: { type: Number },
        hasStarted: { type: Boolean }
    },

    data() {
        return {
            currentTab: "RamOnlyMemory",
            activeTab: {
                "RamOnlyMemory": true,
                "DirectCacheMemory": false,
                "TwoWayCacheMemory": false,
                "FullCacheMemory": false
            }
        }
    },

    methods: {
        ChangeCurrentTab(tab) {
            this.activeTab[this.currentTab] = false;
            this.currentTab = tab;
            this.activeTab[this.currentTab] = true;

            this.cycleCounter.value = 0;
        },
    }
}
</script>

<style>
.tab-container {
    justify-content: center;
    align-items: center;
    width: 98%;
    height: 100%;
    overflow: auto;
    
    padding: 1rem;
    margin-right: 1rem;
    border: solid 15px var(--mainColor);
    border-left-width: 3px;
    border-right-width: 3px;
    border-radius: 15px;
}
.tab-button-row {
    justify-content: flex-start;
    width: 98%;
    margin-right: 1rem;
}
</style>
