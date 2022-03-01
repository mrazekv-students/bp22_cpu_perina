<!--
    A tab container component
!-->

<template>
    <div class="horizontal-container">
        <common-button :displayValue="'RAM-Only Memory'" :function="() => ChangeCurrentTab('RamOnlyMemory')"/>
        <common-button :displayValue="'Direct Cache'" :function="() => ChangeCurrentTab('DirectCacheMemory')"/>
        <common-button :displayValue="'Two-Way Cache'" :function="() => ChangeCurrentTab('TwoWayCacheMemory')"/>
        <common-button :displayValue="'Full Cache'" :function="() => ChangeCurrentTab('')"/>
    </div>
    <component :is="currentTab" @RegisterMemory="RegisterMemory" :instruction="instruction"/>
</template>

<script>
import CommonButton from './common/CommonButton.vue';
import RamOnlyMemory from './memory/RamOnlyMemory.vue';
import DirectCacheMemory from './memory/DirectCacheMemory.vue';
import TwoWayCacheMemory from './memory/TwoWayCacheMemory.vue';
export default {
    name: "TabsContainer",
    components: { CommonButton, RamOnlyMemory, DirectCacheMemory, TwoWayCacheMemory },
    emits: ["RegisterMemory"],

    props: {
        instruction: { type: String }
    },

    data() {
        return {
            currentTab: "RamOnlyMemory"
        }
    },

    methods: {
        ChangeCurrentTab(tab) {
            this.currentTab = tab;
        },
        RegisterMemory(memory) {
            this.$emit("RegisterMemory", memory);
        }
    }
}
</script>