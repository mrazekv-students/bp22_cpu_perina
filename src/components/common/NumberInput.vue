<!--
    A number input with label
!-->

<template>
    <div class="number-input horizontal-container">
        <span>{{ label }}</span>
        <input :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))"/>
    </div>
</template>

<script>
export default {
    name: "NumberInput",
    props: {
        label: { type: String, required: true },
        modelValue: { type: Number, required: true }
    },
}
</script>

<style>
.number-input {
    justify-content: space-between;
    font-size: 1rem;
}
.number-input + .number-input {
    margin-top: 0.2rem;
}
.number-input span {
    display: inline-flex;
    margin-left: 0.8rem;
    align-items: center;
}
.number-input input {
    width: 6rem;
    padding: 0.2rem 0.5rem;
    border: solid 4px var(--mainColor);
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-radius: 5px;
    font-size: inherit;
    font-weight: bold;
    color: inherit;
    background: var(--mainColorDarkDark);
}
.number-input input:focus {
    outline: none;
    border-color: var(--fontColor);
    background: var(--mainColorDark);
}
</style>
