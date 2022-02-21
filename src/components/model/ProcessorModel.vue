<!--
    Visual only component for processor
!-->

<template>
    <div class="vertical-container processor">
        <div>CPU</div>
        <div>[ {{ currentInstruction }} ]</div>
    </div>
</template>

<script>
export default {
    name: "ProcessorModel",
    props: {
        currentInstruction: { type: String, default: "" }
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