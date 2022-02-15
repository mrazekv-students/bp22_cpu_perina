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
                <code-editor ref="codeEditor"/>
            </div>
        </div>
        <div class="model-container">
            <processor ref="processor"/>
        </div>

        <!-- TEST: TEST buttons !-->
        <div class="vertical-container">
            <div class="test-button" @click="$refs.codeEditor.ValidateProgram()">
                Validate
            </div>
            <div class="test-button" @click="$refs.codeEditor.GetInstruction(5)">
                Get instruction
            </div>
            <div class="test-button" @click="$refs.codeEditor.GetLabel('test')">
                Get label
            </div>
        </div>
    </div>
</template>

<script>
import CommonButton from './common/CommonButton.vue';
import CodeEditor from './codeEditor/CodeEditor.vue';
import Processor from './model/Processor.vue';
export default {
    name: "TheLayout",
    components: { CommonButton, CodeEditor, Processor },

    data() {
        return {
            commonButtons: [
                {display: "|>", funcName: "start"},
                {display: "|||", funcName: "stop"},
                {display: "||", funcName: "pause"},
                {display: ">", funcName: "step"}
            ]
        }
    },

    methods: {
        OnButtonClicked(functionName) {
            console.log("Button " + functionName + " clicked.");
        },
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

    background: darkslategray;
}
.model-container {
    display: flex;
    justify-content: center;
    align-items: center;
    
    width: 70%;
    height: 100%;

    background: blue;
}

.control-button {
    width: 4.5rem;
    height: 4.5rem;
    margin: 0.3rem;

    font-size: 3rem;
    font-weight: bold;
}
.test-button {
    width: 6rem;
    height: 3rem;
    margin: 0.2rem;
    background: black;
}
</style>