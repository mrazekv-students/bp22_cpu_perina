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

export default {
    name: "CodeEditor",
    components: { PrismEditor },

    data() {
        return {
            code: "",
        }
    },

    methods: {
        HighlightCode(code) {
            return highlight(code, languages.js);
        },
        ValidateProgram() {
            // TODO: Validates syntax and semantics of program in code editor (this.code)
            // TODO: Populates instructionsDict and labelDict
        },
        GetInstruction(address) {
            // TODO: Gets instruction at address
            console.log(address);
        },
        GetLabel(label) {
            // TODO: Gets address of label
            console.log(label);
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