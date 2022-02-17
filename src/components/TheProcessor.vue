<!--
    The main component serving as core/processor of application
    Communicates with other components and runs simulation
    Contains application layout, most of general layouting should be done here
!-->

<template>
    <div class="horizontal-container">
        <div class="vertical-container control-container">
            <div class="horizontal-container button-container">
                <common-button v-for="button in commonButtons" :key="button" :displayValue="button.display" :function="button.function" class="control-button"/>
            </div>
            <div class="program-container">
                <code-editor @RegisterCompiler="RegisterCompiler"/>
            </div>
        </div>
        <div class="vertical-container model-container">
            <processor-model />
            <ram-only-memory @RegisterMemory="RegisterMemory"/>
        </div>

        <!-- TEST: TEST buttons !-->
        <div class="vertical-container">
            <div class="test-button" @click="$refs.codeEditor.CompileProgram()">
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
import RamOnlyMemory from './memory/RamOnlyMemory.vue';
import ProcessorModel from './model/ProcessorModel.vue';
import Cpu from '@/scripts/Cpu.js';
export default {
    name: "TheLayout",
    components: { CommonButton, CodeEditor, RamOnlyMemory, ProcessorModel },

    data() {
        return {
            commonButtons: [
                { display: "|>", function: this.StartProgram },
                { display: "|||", function: this.StopProgram },
                { display: "||", function: this.PauseProgram },
                { display: ">", function: this.StepProgram }
            ],
            compiler: null,
            memory: null,
            cpu: null,

            instructionPointer: 0,
            accumulator: { value: 0 }
        }
    },

    methods: {
        StartProgram() {
            console.log("Start program");
            this.cpu = new Cpu(this.memory, this.accumulator);
            this.compiler.compile();
        },
        StopProgram() {
            console.log("Stop program");
        },
        PauseProgram() {
            console.log("Pause program");
        },
        StepProgram() {
            console.log("Step in program");
        },

        RegisterCompiler(compiler) {
            this.compiler = compiler;
        },
        RegisterMemory(memory) {
            this.memory = memory;
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