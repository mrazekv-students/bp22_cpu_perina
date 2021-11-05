<!--
    Main component, contains other components. 
    TODO:
        - Control buttons
        - A lot
!-->

<template>
    <div class="the-layout">
        <control-button-row/>
        <ProgramField/>
    </div>
</template>

<script>
import ControlButtonRow from './controls/ControlButtonRow.vue'
import ProgramField from './program/ProgramField.vue'
export default {
    name: "TheLayout",
    components: { ControlButtonRow, ProgramField },
}
</script>

<style>
</style>