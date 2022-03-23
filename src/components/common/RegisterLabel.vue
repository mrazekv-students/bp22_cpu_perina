<!--
    A register component with label and value
!-->

<template>
    <div class="register-label">
        <span v-show="label != null" class="title">{{ label }}</span>
        <span class="value">{{ value }}</span>
    </div>
</template>

<script>
export default {
    name: "RegisterLabel",

    props: {
        label: { type: String, default: null },
        value: { required: true }
    },
}
</script>

<style>
.register-label {
    font-size: 1.2rem;
}
.register-label>.title {
    margin-right: 0.5rem;
    color: var(--fontColorFaded);
}
.register-label>.value {
    display: inline-block;
    min-width: 3em;
    padding: 0.2rem 0.5rem;
    border: solid 4px var(--mainColor);
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-radius: 5px;

    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    background: var(--consoleColor);
}
</style>
