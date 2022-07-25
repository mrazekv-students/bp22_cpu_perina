<!--
    An icon button.
!-->

<template>
    <button v-tooltip="tooltip" class="icon-button" v-if="visible" :disabled="disabled" @click="Click">
        <i :class="displayIcon"/>
    </button>
</template>

<script>
export default {
    name: "IconButton",

    props: {
        displayIcon: { type: String, required: true },
        function: { type: Function, required: true },
        tooltip: { type: String, default: "" },
        visible: { type: Boolean, default: true },
        disabled: { type: Boolean, default: false }
    },

    methods: {
        Click() {
            this.function();
        }
    }
}
</script>

<style>
.icon-button {
    display: flex;
    justify-content: center;
    align-items: center;
    
    border: none;
    box-shadow: none;
    background: var(--mainColor);
    user-select: none;
    font-family: 'Font Awesome\ 5 Free';

    color: inherit;
    cursor: pointer;
    transition: all .1s ease-in-out;
}
.icon-button i {
    font-style: normal;
}
.icon-button:enabled:hover {
    transform: scale(1.1);
}
.icon-button:enabled:active {
    transform: scale(.90);
}
.icon-button:disabled {
    background: var(--mainColorDisabled);
    cursor: initial;
}

</style>