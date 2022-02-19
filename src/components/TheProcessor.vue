<!--
    The main component serving as core/processor of application
    Communicates with other components and runs simulation
    Contains application layout, most of general layouting should be done here
!-->

<template>
    <div class="horizontal-container">
        <div class="vertical-container control-container">
            <div class="horizontal-container button-container">
                <common-button v-for="button in commonButtons" :key="button" :displayValue="button.display" :function="button.function" :disabled="button.disabled" class="control-button"/>
            </div>
            <div class="program-container">
                <code-editor @RegisterCompiler="RegisterCompiler"/>
            </div>
        </div>
        <div class="vertical-container model-container">
            <processor-model :currentInstruction="instruction"/>
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
                { display: "|>", function: this.StartProgram, disabled: false },
                { display: "|||", function: this.StopProgram, disabled: true },
                { display: "||", function: this.PauseProgram, disabled: true},
                { display: ">", function: this.ExecuteInstruction, disabled: true }
            ],
            compiler: null,
            memory: null,
            cpu: null,

            instructionPointer: 0,
            accumulator: { value: 0 },
            instruction: { instruction: "" },

            isCompiled: false
        }
    },

    methods: {
        // Simulation control methods
        StartProgram() {
            console.log("Start program");

            // Compile program
            try {
                this.compiler.compile();
                this.ProgramCompiled();
            }
            catch (e) {
                console.error("Compilation failed");
                return;
            }

            // Create CPU
            this.cpu = new Cpu(this.memory, this.accumulator);

            // TODO: Program loop
        },
        StopProgram() {
            console.log("Stop program");
        },
        PauseProgram() {
            console.log("Pause program");
        },
        ExecuteInstruction() {
            if (this.isCompiled) {
                try {
                    this.instruction = this.compiler.getInstruction(this.instructionPointer);
                    var result = this.cpu.execute(this.instruction);

                    console.log(this.instruction);

                    // Process result
                    if (typeof(result) == "string") {
                        this.instructionPointer = this.compiler.getLabel(result) + 1;
                    }
                    else if (typeof(result) == "number") {
                        this.instructionPointer = result;
                    }
                    else if (result) {
                        this.instructionPointer++;
                    }
                    else {
                        console.log("Program halted");
                        this.instructionPointer++;
                    }
                }
                catch (e) {
                    console.error("Execution failed");
                    return;
                }
            }
            else throw Error("Program is not compiled");
        },

        // Component registration methods
        RegisterCompiler(compiler) {
            this.compiler = compiler;
        },
        RegisterMemory(memory) {
            this.memory = memory;
        },

        // Other methods
        ProgramCompiled() {
            this.commonButtons[1].disabled = false;
            this.commonButtons[2].disabled = false;
            this.commonButtons[3].disabled = false;
            this.isCompiled = true;
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