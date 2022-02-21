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
export default {
    name: "CodeEditor",
    components: { PrismEditor },
    emits: ["RegisterCompiler"],

    data() {
        return {
            code: "",
            instructionList: [],
            labelDict: {},
        }
    },

    created() {
        this.$emit("RegisterCompiler", { compile: this.CompileProgram, getInstruction: this.GetInstruction, getLabel: this.GetLabel })
    },

    methods: {
        HighlightCode(code) {
            // TODO: Define all highlighting, move to its own file
            Prism.languages.bp22 = {
                'operator': /\b(?:HALT|NEGATE|ACCDEC|ACCINC|NOP|OUTP|INP|MLOAD|DLOAD|ILOAD|DSTORE|ISTORE|BRANCH|BRZERO|BRPOS|BRNEG|MADD|IJUMP|LABEL)\b/i,
            };

            return Prism.highlight(code, Prism.languages.bp22);
        },
        
        CompileProgram() {
            this.instructionList = [];
            this.labelDict = {};

            try {
                startCompilation(this.code, this.instructionList);
            }
            catch (e) {
                // TODO: Show error for user
                console.error(e);
                throw e;
            }
            
            // Populate labelDict
            for (var i in this.instructionList) {
                if (this.instructionList[i].instruction == "LABEL") {
                    this.labelDict[this.instructionList[i].label] = parseInt(i);
                }
            }

            console.log(this.instructionList);
            console.log(this.labelDict);
        },
        GetInstruction(address) {
            if (address < this.instructionList.length)
                return this.instructionList[address];
            else throw RangeError("Invalid instruction address");
        },
        GetLabel(label) {
            if (label in this.labelDict)
                return this.labelDict[label];
            else throw RangeError("No such label");
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