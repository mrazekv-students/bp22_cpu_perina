<!--
    Visual only component for processor
!-->

<template>
    <div class="vertical-container processor">
        <div>CPU</div>
        <div>[ {{ currentInstruction.instruction }} ]</div>
    </div>
</template>

<script>
export default {
    name: "ProcessorModel",
    props: {
        currentInstruction: { default: { instruction: "" } }
    }
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