<!--
    Main component, contains other components. 
    TODO:
        - Control buttons
        - A lot
!-->

<template>
    <div class="horizontal-container">
        <div class="vertical-container control-container">
            <div class="horizontal-container button-container">
                <control-button v-for="button in controlButtons" :key="button" :displayValue="button.display" :functionName="button.funcName"
                    @button-clicked="OnButtonClicked"/>
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
import ControlButton from './common/ControlButton.vue'
export default {
    name: "TheLayout",
    components: { ControlButton },

    data() {
        return {
            controlButtons: [
                {display: "|>", funcName: "start"},
                {display: "|||", funcName: "stop"},
                {display: "||", funcName: "pause"},
                {display: ">", funcName: "step"}
            ],
        }
    },

    methods: {
        OnButtonClicked(functionName) {
            console.log("Button " + functionName + " clicked");
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
    width: 100%;
    height: 10%;
    justify-content: center;

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