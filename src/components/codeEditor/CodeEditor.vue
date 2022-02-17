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
import Prism from 'prismjs/components/prism-core';
import 'prismjs/themes/prism-dark.css'; // TODO: Study and create my own

import startCompilation from '@/scripts/Compiler.js';
import eventHub from '@/scripts/EventHub.js';
export default {
    name: "CodeEditor",
    components: { PrismEditor },

    data() {
        return {
            code: "",
            instructionList: [],
            labelDict: {},

            eventHub: eventHub
        }
    },

    created() {
        eventHub.getInstruction = this.GetInstruction;
        eventHub.getLabel = this.GetLabel;
    },

    methods: {
        HighlightCode(code) {
            // TODO: Define all highlighting, move to its own file
            Prism.languages.bp22 = {
                'operator': /\b(?:HALT|NEGATE|ACCDEC|ACCINC|NOP|OUTP|INP|MLOAD|DLOAD|ILOAD|DSTORE|ISTORE|BRANCH|BRZERO|BRPOS|BRNEG|MADD|IJUMP|LABEL)\b/i,
            };

            return Prism.highlight(code, Prism.languages.bp22);
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