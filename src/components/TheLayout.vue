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
import ControlButtonRow from './controls/ControlButtonRow.vue'
export default {
    components: { ControlButtonRow },
    name: "TheLayout",

    
}
</script>

<style>

</style>