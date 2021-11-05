<!--
    Row containig control buttons.
    Contains 4 buttons: Start program, End program, Stop program, Next step
!-->

<template>
    <div class="control-button-row">
        <control-button v-for="button in controlButtons" :key="button" :displayValue="button.display" :functionName="button.funcName"
        @button-clicked="OnButtonClicked"/>
    </div>
</template>

<script>
import ControlButton from './ControlButton.vue'
export default {
  components: { ControlButton },
    name: "ControlButtonRow",

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
            switch (functionName) {
                case this.controlButtons[0].funcName:
                case this.controlButtons[1].funcName:
                case this.controlButtons[2].funcName:
                case this.controlButtons[3].funcName:
                    this.$emit(functionName);
                    break;
                default:
                    console.error("Unknown control button clicked.");
                    break;
            }
        }
    }
}
</script>

<style>
.control-button-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 5em;
    width: 18em;
    margin: .5em 1em .5em 1.5em;

    border-style: dotted;
    border-width: 2px;
}
</style>