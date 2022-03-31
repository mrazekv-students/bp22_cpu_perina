<!--
    A code editor component
!-->

<template>
    <prism-editor class="code-editor" v-model="code" :highlight="HighlightCode" :line-numbers="true" :autoStyleLineNumbers="true" />
</template>

<script>
// Prism Editor: https://github.com/koca/vue-prism-editor/tree/feature/next
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
// Highlighting library: https://prismjs.com/
import Prism from 'prismjs/components/prism-core';

import startCompilation from '@/scripts/Compiler.js';
import { bp22Highlight } from './bp22/bp22Highlighting.js';
import './bp22/bp22Style.css';
export default {
    name: "CodeEditor",
    components: { PrismEditor },
    emits: ["RegisterCompiler"],

    data() {
        return {
            code: "",
            instructionList: [],
            labelDict: {},
            highlightedLine: -1
        }
    },

    created() {
        this.$emit("RegisterCompiler", { 
            compile: this.CompileProgram, 
            getInstruction: this.GetInstruction, 
            getLabel: this.GetLabel, 
            getNextLine: this.GetNextLine, 
            highlightLine: this.HighlightLine })
    },

    methods: {
        HighlightCode(code) {
            Prism.languages.bp22 = bp22Highlight;
            return Prism.highlight(code, Prism.languages.bp22);
        },
        HighlightLine(lineNumber) {
            // Remove highlighting
            if (this.highlightedLine >= 0 )
            {
                var oldLine = this.$el.querySelector(`.prism-editor__line-number:nth-child(${this.highlightedLine + 1})`);
                if (!oldLine) return;
                oldLine.classList.remove('highlight-line');
            }

            this.highlightedLine = lineNumber;

            // Highlight
            if (lineNumber >= 0)
            {
                var newLine = this.$el.querySelector(`.prism-editor__line-number:nth-child(${lineNumber + 1})`);
                if (!newLine) return;
                newLine.classList.add('highlight-line');
            }
            
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
        },
        GetNextLine(address) {
            if (address < this.instructionList.length)
                return this.instructionList[address].line;
            else return -1;
        }
    }
}
</script>

<style>
.code-editor {
    font-family: Consolas, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
}
.prism-editor__textarea:focus {
    outline: none;
}
.prism-editor-wrapper .prism-editor__line-number.highlight-line {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    padding-right: 0.3rem;
    background: var(--secondaryColor);
    color: white;
}
</style>