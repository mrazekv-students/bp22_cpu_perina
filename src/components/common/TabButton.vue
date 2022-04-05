<!--
    A tab button.
!-->

<template>
    <button :class="'tab-button' + (active ? ' active' : '')" :disabled="disabled" @click="Click">
        <span>
            {{ displayValue }}
        </span>
    </button>
</template>

<script>
export default {
    name: "TabButton",

    props: {
        displayValue: { type: String, required: true },
        function: { type: Function, required: true },
        disabled: { type: Boolean, default: false },
        active: { type: Boolean, default: false }
    },

    methods: {
        Click() {
            this.function();
        }
    }
}
</script>

<style>
.tab-button {
    display: flex;
    justify-content: center;

    width: 9rem;
    padding: .6rem;
    margin-left: 1.2rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: none;
    user-select: none;

    font-size: 1.4rem;
    font-weight: bold;
    text-transform: uppercase;

    color: inherit;
    background: var(--mainColorLightDark);
    cursor: pointer;
    transition: all .1s ease-in-out;
}
.tab-button:hover {
    transform: scaleY(120%);
    transform-origin: bottom left;
}

.tab-button.active,
.tab-button.active:disabled:hover {
    transform: scaleY(120%);
    transform-origin: bottom left;
    background: var(--mainColor);
}

.tab-button span {
    margin-top: auto;
    transition: all .1s ease-in-out;
}
.tab-button:hover span, 
.tab-button.active span,
.tab-button.active:disabled:hover span {
    transform: scaleY(83.33%);
}
.tab-button:disabled:hover span {
    transform: none;
}

.tab-button:disabled {
    background: var(--mainColorDisabled);
    cursor: initial;
}
.tab-button.active:disabled {
    background: var(--mainColor);
}
.tab-button:disabled:hover {
    transform: none;
}

</style>