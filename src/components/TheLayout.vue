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
                <prism-editor class="code-editor" v-model="code" :highlight="HighlightCode" line-numbers></prism-editor>
            </div>
        </div>
        <div class="model-container">
            <!-- TODO !-->
        </div>
    </div>
</template>

<script>
// Prism Editor: https://github.com/koca/vue-prism-editor/tree/feature/next
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
// Highlighting library: https://prismjs.com/
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-javascript';
// My components
import CommonButton from './common/CommonButton.vue'

export default {
    name: "TheLayout",
    components: { PrismEditor, CommonButton },

    data() {
        return {
            commonButtons: [
                {display: "|>", funcName: "start"},
                {display: "|||", funcName: "stop"},
                {display: "||", funcName: "pause"},
                {display: ">", funcName: "step"}
            ],
            code: "",
        }
    },

    methods: {
        OnButtonClicked(functionName) {
            console.log("Button " + functionName + " clicked.");
        },
        HighlightCode(code) {
            return highlight(code, languages.js);
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

    background: darkslategray;
}
.model-container {
    width: 70%;
    height: 100%;

    background: blue;
}

.code-editor {
    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
}
.prism-editor__textarea:focus {
    outline: none;
}
</style>