<!--
    A tab container component
!-->

<template>
    <div class="horizontal-container tab-button-row">
        <tab-button :displayValue="'RAM-Only Memory'" :disabled="hasStarted" :active="activeTab['RamOnlyMemory']"
            :function="() => ChangeCurrentTab('RamOnlyMemory')" v-tooltip="tooltips.ramOnlyMemory"/>
        <tab-button :displayValue="'Direct Cache'" :disabled="hasStarted" :active="activeTab['DirectCacheMemory']"
            :function="() => ChangeCurrentTab('DirectCacheMemory')" v-tooltip="tooltips.directCacheMemory"/>
        <tab-button :displayValue="'Two-Way Cache'" :disabled="hasStarted" :active="activeTab['TwoWayCacheMemory']"
            :function="() => ChangeCurrentTab('TwoWayCacheMemory')" v-tooltip="tooltips.twoWayCacheMemory"/>
        <tab-button :displayValue="'Full Cache'" :disabled="hasStarted" :active="activeTab['FullCacheMemory']"
            :function="() => ChangeCurrentTab('FullCacheMemory')" v-tooltip="tooltips.fullCacheMemory"/>
    </div>
    <div class="horizontal-container tab-container">
        <component :is="currentTab" @RegisterMemory="(e) => $emit('RegisterMemory', e)" @RegisterRegs="(e) => $emit('RegisterRegs', e)"
            :instruction="instruction" :instructionPointer="instructionPointer"
            :accumulator="accumulator" :addressPointer="addressPointer"/>
    </div>
</template>

<script>
import TabButton from './common/TabButton.vue';
import RamOnlyMemory from './memory/RamOnlyMemory.vue';
import DirectCacheMemory from './memory/DirectCacheMemory.vue';
import TwoWayCacheMemory from './memory/TwoWayCacheMemory.vue';
import FullCacheMemory from './memory/FullCacheMemory.vue'
export default {
    name: "TheTabContainer",
    components: { TabButton, RamOnlyMemory, DirectCacheMemory, TwoWayCacheMemory, FullCacheMemory },
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
            },
            tooltips: {
                ramOnlyMemory: { content: "<p>Memory with no cache</p><p>Shortcut: [<b>1</b>]</p>", html: true },
                directCacheMemory: { content: "<p>Memory with directly mapped cache</p><p>Shortcut: [<b>2</b>]</p>", html: true },
                twoWayCacheMemory: { content: "<p>Memory with two way associative cache</p><p>Shortcut: [<b>3</b>]</p>", html: true },
                fullCacheMemory: { content: "<p>Memory with fully associative cache</p><p>Shortcut: [<b>4</b>]</p>", html: true }
            }
        }
    },

    created() {
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "+":
                case "1":
                    if (this.currentTab != "RamOnlyMemory") this.ChangeCurrentTab("RamOnlyMemory");
                    break;

                case "ě":
                case "2":
                    if (this.currentTab != "DirectCacheMemory") this.ChangeCurrentTab("DirectCacheMemory");
                    break;
                
                case "š":
                case "3":
                    if (this.currentTab != "TwoWayCacheMemory") this.ChangeCurrentTab("TwoWayCacheMemory");
                    break;
                
                case "č":
                case "4":
                    if (this.currentTab != "FullCacheMemory") this.ChangeCurrentTab("FullCacheMemory");
                    break;
            }
        })
    },

    methods: {
        ChangeCurrentTab(tab) {
            this.activeTab[this.currentTab] = false;
            this.currentTab = tab;
            this.activeTab[this.currentTab] = true;
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
