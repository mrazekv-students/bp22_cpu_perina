<!--
    A common button.
!-->

<template>
    <div class="common-button" @click="Click">
        <span>
            {{ displayValue }}
        </span>
    </div>
</template>

<script>
export default {
    name: "CommonButton",

    props: {
        displayValue: {
            type: String,
            required: true,
        },
        functionName: {
            type: String,
            required: true,
        },
    },

    methods: {
        Click() {
            console.log("Button " + this.functionName + " clicked.");
            this.$emit("button-clicked", this.functionName);
        }
    }
}
</script>

<style>
.common-button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 2rem;
    height: 2rem;

    background: rgb(82, 82, 82);

    cursor: pointer;
    transition: all .1s ease-in-out;
}
.common-button:hover {
    transform: scale(1.1);
}
.common-button:active {
    transform: scale(.90);
}
</style>