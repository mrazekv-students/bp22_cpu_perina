<!--
    A tab container component
!-->

<template>
    <div class="horizontal-container tab-button-row">
        <common-button :displayValue="'RAM-Only Memory'" :function="() => ChangeCurrentTab('RamOnlyMemory')" :class="'tab-button ' + activeTab['RamOnlyMemory']"/>
        <common-button :displayValue="'Direct Cache'" :function="() => ChangeCurrentTab('DirectCacheMemory')" :class="'tab-button ' + activeTab['DirectCacheMemory']"/>
        <common-button :displayValue="'Two-Way Cache'" :function="() => ChangeCurrentTab('TwoWayCacheMemory')" :class="'tab-button ' + activeTab['TwoWayCacheMemory']"/>
        <common-button :displayValue="'Full Cache'" :function="() => ChangeCurrentTab('FullCacheMemory')" :class="'tab-button ' + activeTab['FullCacheMemory']"/>
        <cycle-counter/>
    </div>
    <div class="tab-container vertical-container">
        <component :is="currentTab" @RegisterMemory="RegisterMemory" :instruction="instruction"/>
    </div>
</template>

<script>
import CommonButton from './common/CommonButton.vue';
import CycleCounter from './common/CycleCounter.vue';
import RamOnlyMemory from './memory/RamOnlyMemory.vue';
import DirectCacheMemory from './memory/DirectCacheMemory.vue';
import TwoWayCacheMemory from './memory/TwoWayCacheMemory.vue';
import FullCacheMemory from './memory/FullCacheMemory.vue'
export default {
    name: "TabsContainer",
    components: { CommonButton, CycleCounter, RamOnlyMemory, DirectCacheMemory, TwoWayCacheMemory, FullCacheMemory },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String }
    },

    data() {
        return {
            currentTab: "RamOnlyMemory",
            activeTab: {
                "RamOnlyMemory": "active",
                "DirectCacheMemory": "",
                "TwoWayCacheMemory": "",
                "FullCacheMemory": ""
            }
        }
    },

    methods: {
        ChangeCurrentTab(tab) {
            this.activeTab[this.currentTab] = "";
            this.currentTab = tab;
            this.activeTab[this.currentTab] = "active";
        },
        RegisterMemory(memory) {
            this.$emit("RegisterMemory", memory);
        }
    }
}
</script>

<style>
.tab-container {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-right: 2rem;
    border: solid 5px var(--mainColor);
    border-radius: 10px;
}
.tab-button-row {
    justify-content:flex-start;
    width: 100%;
    margin-right: 2rem;
}

.tab-button {
    width: 9rem;
    min-width: 9rem;
    padding: .6rem;
    margin-left: 1.2rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    font-size: 1.4rem;
    font-weight: bold;
    text-transform: uppercase;
    background: var(--mainColorDisabled);
}
.tab-button:hover {
    transform: scaleY(120%);
    transform-origin: bottom left;
}
.tab-button.active {
    transform: scaleY(120%);
    transform-origin: bottom left;
    background: var(--mainColor);
}
.tab-button:hover span, 
.tab-button.active span {
    transform: scaleY(83.33%);
}

.test {
    align-self: flex-end;
    margin-left: auto;
}
</style>
