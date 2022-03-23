<!--
    The main component serving as core/processor of application
    Communicates with other components and runs simulation
    Contains application layout, most of general layouting should be done here
!-->

<template>
    <div class="vertical-container" style="height: 100%">
        <the-title :title="'Cache Simulator'" :author="'Daniel Peřina'" :organisation="'Brno University of Technology'" :suborganisation="'Faculty of Information Technology'" :date="'2022'"/>

        <div class="horizontal-container main-container">
            <div class="vertical-container control-container">
                <div class="horizontal-container button-container">
                    <icon-button v-for="button in controlButtons" :key="button" :displayIcon="button.display" :function="button.function" :disabled="button.disabled" class="control-button"/>
                </div>

                <div class="program-container">
                    <code-editor @RegisterCompiler="RegisterCompiler"/>
                </div>
            </div>

            <div class="vertical-container model-container">
                <tabs-container @RegisterMemory="RegisterMemory" :instruction="instruction.instruction" :instructionPointer="instructionPointer" :accumulator="accumulator.value"/>
            </div>
        </div>
    </div>
</template>

<script>
const s_notStarted = "notStarted";
const s_started = "started";
const s_halted = "halted";
const s_ended = "ended"

import IconButton from './common/IconButton.vue';
import CodeEditor from './codeEditor/CodeEditor.vue';
import TabsContainer from './TabsContainer.vue';
import TheTitle from './TheTitle.vue'

import Cpu from '@/scripts/Cpu.js';
import ExecutionResult from '@/scripts/ExecutionResult.js'
export default {
    name: "TheLayout",
    components: { IconButton, CodeEditor, TabsContainer, TheTitle },

    data() {
        return {
            controlButtons: [
                { display: "fa-solid fa-play", function: this.StartProgram, disabled: false },
                { display: "fa-solid fa-stop", function: this.StopProgram, disabled: true },
                { display: "fa-solid fa-pause", function: this.PauseProgram, disabled: true},
                { display: "fa-solid fa-forward-step", function: this.ExecuteInstruction, disabled: true }
            ],
            compiler: null,
            memory: null,
            cpu: null,
            currentState: s_notStarted,

            instructionPointer: 0,
            accumulator: { value: 0 },
            instruction: { instruction: "INST" },
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
            console.log("X")
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
                this.ChangeSimulationState(s_ended);
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
                    this.controlButtons[0].disabled = false;
                    this.controlButtons[1].disabled = true;
                    this.controlButtons[2].disabled = true;
                    this.controlButtons[3].disabled = true;
                    this.ResetState();
                    break;

                case s_started:
                    this.controlButtons[0].disabled = true;
                    this.controlButtons[1].disabled = false;
                    this.controlButtons[2].disabled = false;
                    this.controlButtons[3].disabled = true;
                    break;

                case s_halted:
                    this.controlButtons[0].disabled = false;
                    this.controlButtons[1].disabled = false;
                    this.controlButtons[2].disabled = true;
                    this.controlButtons[3].disabled = false;
                    break;

                case s_ended:
                    this.controlButtons[0].disabled = false;
                    this.controlButtons[1].disabled = true;
                    this.controlButtons[2].disabled = true;
                    this.controlButtons[3].disabled = true;
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
            this.instruction = { instruction: "INST" };
            this.memory.reset();
        }
    }
}
</script>

<style>
.main-container {
    height: 100%;
    padding-top: 1rem;
    padding-bottom: 1.5rem;
}
.control-container {
    width: 30%;
    min-width: 450px;
}
.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
}
.program-container {
    width: 85%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;

    overflow-y: auto;
    border: solid 15px var(--mainColor);
    border-left-width: 3px;
    border-right-width: 3px;
    border-radius: 15px;
    background: var(--programBackgroundColor);
}
.model-container {
    display: flex;
    align-items: center;
    width: 70%;
    min-width: 800px;
    margin-top: 1.5rem;
}

.control-button {
    width: 5rem;
    height: 5rem;
    font-size: 3rem;
    border-radius: 10px;
    background: var(--mainColor);
}
.control-button + .control-button {
    margin-left: 1rem;
}
</style>
