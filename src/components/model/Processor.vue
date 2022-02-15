<!--
    A processor component
!-->

<template>
    <div class="vertical-container processor">
        <div>CPU</div>
        <div>[ {{ currentInstruction }} ]</div>
    </div>
</template>

<script>
export default {
    name: "Processor",

    data() {
        return {
            currentInstruction: "NOP",
        }
    },
}
</script>

<style>
.processor {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 27%;
    height: 15%;

    background: red;
}
</style>