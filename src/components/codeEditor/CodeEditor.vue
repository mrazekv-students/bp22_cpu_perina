<!--
    A code editor component
!-->

<template>
    <prism-editor class="code-editor" v-model="code" :highlight="HighlightCode" line-numbers />
</template>

<script>
// Prism Editor: https://github.com/koca/vue-prism-editor/tree/feature/next
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
// Highlighting library: https://prismjs.com/
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
// Compiler
import startCompilation from '@/scripts/Compiler.js';
export default {
    name: "CodeEditor",
    components: { PrismEditor },

    data() {
        return {
            code: "",
            instructionList: [],
            labelDict: {}
        }
    },

    methods: {
        HighlightCode(code) {
            return highlight(code, languages.js);
        },
        ValidateProgram() {
            this.instructionList = [];
            this.labelDict = {}

            var result = startCompilation(this.code, this.instructionList);

            // Error
            if (result.result) {
                console.error("Error " + result.result + " on instruction " + result.instructionNumber + ": " + result.message);
                // TODO: Show error for user
            }
            else {
                // Populate labelDict
                for (var i in this.instructionList) {
                    if (this.instructionList[i].instruction == "LABEL") {
                        this.labelDict[this.instructionList[i].label] = i;
                    }
                }

                console.log(this.instructionList);
                console.log(this.labelDict);
            }
        },
        GetInstruction(address) {
            console.log(this.instructionList[address]);
            return this.instructionList[address];
        },
        GetLabel(label) {
            console.log(this.labelDict[label]);
            return this.labelDict[label];
        }
    }
}
</script>

<style>
.code-editor {
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
}
.prism-editor__textarea:focus {
    outline: none;
}
</style>