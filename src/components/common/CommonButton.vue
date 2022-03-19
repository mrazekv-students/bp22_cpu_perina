<!--
    A common button.
!-->

<template>
    <button class="common-button" :disabled="disabled" @click="Click">
        {{ displayValue }}
    </button>
</template>

<script>
export default {
    name: "CommonButton",

    props: {
        displayValue: {
            type: String,
            required: true,
        },
        function: {
            type: Function,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        Click() {
            this.function();
        }
    }
}
</script>

<style>
.common-button {
    display: flex;
    justify-content: center;
    align-items: center;
    
    border: none;
    box-shadow: none;
    background: var(--mainColor);
    user-select: none;

    color: inherit;
    cursor: pointer;
    transition: all .1s ease-in-out;
}
.common-button:enabled:hover {
    transform: scale(1.1);
}
.common-button:enabled:active {
    transform: scale(.90);
}
.common-button:disabled {
    background: var(--mainColorDisabled);
    cursor: initial;
}

</style>