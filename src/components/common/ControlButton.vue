<!--
    Buttons for controlling program execution
!-->

<template>
    <div class="control-button" @click="ButtonClick">
        {{ displayValue }}
    </div>
</template>

<script>
export default {
    name: "ControlButton",

    props: {
        displayValue: {
            type: String,
            Required: true,
        },
        functionName: {
            type: String,
            Required: true,
        }
    },

    methods: {
        ButtonClick() {
            console.log("ControlButton." + this.functionName + ": clicked.");
            this.$emit("button-clicked", this.functionName);
        }
    }
}
</script>

<style>
.control-button {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;

    width: 2em;
    height: 2em;

    border-radius: 25%;
    box-shadow: 0px 0px 0px 2px;
    font-size: 22pt;
    font-weight: bold;

    cursor: pointer;
    transition: all .1s ease-in-out;
}
.control-button:hover {
    background: #47474B;
}
.control-button:active {
    transform: scale(.90);
    background: #5B5B60;
}
</style>