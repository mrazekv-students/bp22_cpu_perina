<!--
    A tab container component
!-->

<template>
    <div class="horizontal-container">
        <common-button :displayValue="'RAM-Only Memory'" :function="() => ChangeCurrentTab('RamOnlyMemory')"/>
        <common-button :displayValue="'Direct Cache'" :function="() => ChangeCurrentTab('DirectCacheMemory')"/>
        <common-button :displayValue="'Two-Way Cache'" :function="() => ChangeCurrentTab('')"/>
        <common-button :displayValue="'Full Cache'" :function="() => ChangeCurrentTab('')"/>
    </div>
    <component :is="currentTab" @RegisterMemory="RegisterMemory" :instruction="instruction"/>
</template>

<script>
import RamOnlyMemory from './memory/RamOnlyMemory.vue';
import DirectCacheMemory from './memory/DirectCacheMemory.vue'
import CommonButton from './common/CommonButton.vue';
export default {
    name: "TabsContainer",
    components: { RamOnlyMemory, DirectCacheMemory, CommonButton },
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