<!--
    A main component containing application layout.
    Most of layouting should be done here.
!-->

<template>
    <div class="horizontal-container">
        <div class="vertical-container control-container">
            <div class="horizontal-container button-container">
                <common-button v-for="button in commonButtons" :key="button" :displayValue="button.display" :functionName="button.funcName"
                    class="control-button" @button-clicked="OnButtonClicked"/>
            </div>
            <div class="program-container">
                <!-- TODO !-->
            </div>
        </div>
        <div class="model-container">
            <!-- TODO !-->
        </div>
    </div>
</template>

<script>
import CommonButton from './common/CommonButton.vue'
export default {
    name: "TheLayout",
    components: { CommonButton },

    data() {
        return {
            commonButtons: [
                {display: "|>", funcName: "start"},
                {display: "|||", funcName: "stop"},
                {display: "||", funcName: "pause"},
                {display: ">", funcName: "step"}
            ],
        }
    },

    methods: {
        OnButtonClicked(functionName) {
            console.log("Button " + functionName + " clicked.");
        }
    }
}
</script>

<style>
.control-container {
    width: 30%;
    height: 100%;
}
.button-container {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 10%;

    background: red;
}
.program-container {
    width: 100%;
    height: 90%;

    background: green;
}
.model-container {
    width: 70%;
    height: 100%;

    background: blue;
}
</style>