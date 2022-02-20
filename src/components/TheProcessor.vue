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
            <ram-only-memory @RegisterMemory="RegisterMemory"/>
        </div>
    </div>
</template>

<script>
const s_notStarted = "notStarted";
const s_started = "started";
const s_halted = "halted";
const s_ended = "ended"

import CommonButton from './common/CommonButton.vue';
import CodeEditor from './codeEditor/CodeEditor.vue';
//import TabsContainer from './TabsContainer.vue';
import RamOnlyMemory from './memory/RamOnlyMemory.vue';

import Cpu from '@/scripts/Cpu.js';
import ExecutionResult from '@/scripts/ExecutionResult.js'
export default {
    name: "TheLayout",
    components: { CommonButton, CodeEditor, RamOnlyMemory },

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
            currentState: s_notStarted,

            instructionPointer: 0,
            accumulator: { value: 0 },
            instruction: { instruction: "" },
        }
    },

    methods: {
        // Simulation control methods
        async StartProgram() {
            console.log("Start program");

            // Compile program
            if (this.currentState == s_ended) {
                this.ChangeSimulationState(s_notStarted);
            }
            if (this.currentState == s_notStarted) {
                try {
                    this.compiler.compile();
                }
                catch (e) {
                    console.error("Compilation failed");
                    return;
                }

                // Create CPU
                this.cpu = new Cpu(this.memory, this.accumulator);
            }
            this.ChangeSimulationState(s_started);

            // Program loop
            while (this.currentState == s_started) {
                this.ExecuteInstruction();
                await this.Sleep(500);
            }
        },
        StopProgram() {
            console.log("Stop program");
            this.ChangeSimulationState(s_notStarted);
        },
        PauseProgram() {
            console.log("Pause program");
            this.ChangeSimulationState(s_halted);
        },
        ExecuteInstruction() {
            try {
                this.instruction = this.compiler.getInstruction(this.instructionPointer);
                var result = this.cpu.execute(this.instruction);

                console.log(this.instruction);

                // Process result
                if (result.result == ExecutionResult.NextInstruction) {
                    this.instructionPointer++;
                }
                else if (result.result == ExecutionResult.MoveToLabel) {
                    this.instructionPointer = this.compiler.getLabel(result.label) + 1;
                }
                else if (result.result == ExecutionResult.MoveToAddress) {
                    this.instructionPointer = result.address;
                }
                else if (result.result == ExecutionResult.HaltExecution) {
                    console.log("Program halted");
                    this.instructionPointer++;
                    this.ChangeSimulationState(s_halted);
                }
                else if (result.result == ExecutionResult.EndExecution) {
                    console.log("Program end");
                    this.ChangeSimulationState(s_ended);
                }
            }
            catch (e) {
                console.error("Execution failed");
            }
        },

        // Component registration methods
        RegisterCompiler(compiler) {
            this.compiler = compiler;
        },
        RegisterMemory(memory) {
            this.memory = memory;
        },

        // Other methods
        ChangeSimulationState(state) {
            switch (state) {
                case s_notStarted:
                    this.commonButtons[0].disabled = false;
                    this.commonButtons[1].disabled = true;
                    this.commonButtons[2].disabled = true;
                    this.commonButtons[3].disabled = true;
                    this.ResetState();
                    break;

                case s_started:
                    this.commonButtons[0].disabled = true;
                    this.commonButtons[1].disabled = false;
                    this.commonButtons[2].disabled = false;
                    this.commonButtons[3].disabled = true;
                    break;

                case s_halted:
                    this.commonButtons[0].disabled = false;
                    this.commonButtons[1].disabled = false;
                    this.commonButtons[2].disabled = true;
                    this.commonButtons[3].disabled = false;
                    break;

                case s_ended:
                    this.commonButtons[0].disabled = false;
                    this.commonButtons[1].disabled = true;
                    this.commonButtons[2].disabled = true;
                    this.commonButtons[3].disabled = true;
                    break;
            }

            this.currentState = state;
        },
        Sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        },
        ResetState() {
            this.instructionPointer = 0;
            this.accumulator = { value: 0 };
            this.instruction = { instruction: "" };
            this.memory.reset();
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