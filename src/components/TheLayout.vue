<!--
    Main component, contains other components. 
    TODO:
        - Control buttons
        - A lot
!-->

<template>
    <div class="the-layout">
        <control-button-row/>
    </div>
</template>

<script>
import ControlButtonRow from './common/ControlButtonRow.vue'
export default {
    name: "TheLayout",
    components: { ControlButtonRow },
}
</script>

<style>
</style>