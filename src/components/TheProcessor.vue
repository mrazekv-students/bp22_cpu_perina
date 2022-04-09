<!--
    The main component serving as core/processor of application
    Communicates with other components and runs simulation
    Contains application layout, most of general layouting should be done here
!-->

<template>
    <div class="vertical-container main-container">
        <the-title :title="'Cache Simulator'" :author="'Daniel Peřina'" :date="'2022'"
            :organisation="'Brno University of Technology'" :suborganisation="'Faculty of Information Technology'" 
            @UpdateSettings="Initialize"/>

        <div class="horizontal-container app-container">
            <div class="vertical-container control-container">
                <div class="horizontal-container button-container">
                    <icon-button v-for="button in controlButtons" :key="button" :displayIcon="button.display" :function="button.function" :disabled="button.disabled" class="control-button"/>
                </div>

                <div class="program-container">
                    <code-editor :hasStarted="hasStarted" @RegisterCompiler="RegisterCompiler"/>
                </div>
            </div>

            <div class="vertical-container model-container">
                <the-tab-container @RegisterMemory="RegisterMemory" :hasStarted="hasStarted"
                    :instruction="instruction.instruction" :instructionPointer="instructionPointer"
                    :accumulator="accumulator.value" :addressPointer="addressPointer.value"/>
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
import TheTabContainer from './TheTabContainer.vue';
import TheTitle from './TheTitle.vue';

import Cpu from '@/scripts/Cpu.js';
import ExecutionResult from '@/scripts/enums/ExecutionResult.js';
import Sleep from '@/scripts/Sleep.js';
export default {
    name: "TheLayout",
    components: { IconButton, CodeEditor, TheTabContainer, TheTitle },

    computed: {
        hasStarted() {
            if (this.currentState == s_notStarted || this.currentState == s_ended) return false;
            else return true;
        }
    },

    data() {
        return {
            controlButtons: [
                { display: "fa-solid fa-play", function: this.StartProgram, disabled: false },
                { display: "fa-solid fa-stop", function: this.StopProgram, disabled: true },
                { display: "fa-solid fa-pause", function: this.PauseProgram, disabled: true},
                { display: "fa-solid fa-forward-step", function: this.ExecuteInstruction, disabled: true }
            ],
            compiler: { compile: null, getInstruction: null, getLabel: null, getNextLine: null, highlightLine: null },
            memory: { write: null, read: null, flush: null, initialize: null },
            cpu: null,
            currentState: s_notStarted,

            instructionPointer: 0,
            accumulator: { value: 0 },
            addressPointer: { value: 0 },
            instruction: { instruction: "INST", line: 0 },
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
                this.Initialize();
                this.cpu = new Cpu(this.memory, this.accumulator, this.addressPointer, this.cycleCounter);
            }
            this.ChangeSimulationState(s_started);
            this.compiler.highlightLine(-1);

            // Program loops
            while (this.currentState == s_started) {
                await this.ExecuteInstruction();
                await Sleep(this.instructionWaitTime.value);
            }
        },
        StopProgram() {
            console.log("Stop program");
            this.compiler.highlightLine(-1);
            this.ChangeSimulationState(s_notStarted);
            this.Initialize();
        },
        PauseProgram() {
            console.log("Pause program");
            this.compiler.highlightLine(this.compiler.getNextLine(this.instructionPointer));
            this.ChangeSimulationState(s_halted);
        },
        async ExecuteInstruction() {
            try {
                if (this.currentState == s_halted) {
                    this.controlButtons[3].disabled = true;
                }

                // Execute instruction
                this.instruction = this.compiler.getInstruction(this.instructionPointer);
                var result = await this.cpu.execute(this.instruction);

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
                    this.compiler.highlightLine(-1);
                    this.ChangeSimulationState(s_ended);
                }

                // Highlight current line if going manually
                if (this.currentState == s_halted) {
                    this.compiler.highlightLine(this.compiler.getNextLine(this.instructionPointer));
                    this.controlButtons[3].disabled = false;
                }
            }
            catch (e) {
                // TODO: Error message
                console.error("Execution failed");
                console.error(e);
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
        Initialize() {
            this.instructionPointer = 0;
            this.accumulator = { value: 0 };
            this.addressPointer = { value: 0 };
            this.instruction = { instruction: "INST" };
            this.cycleCounter.value = 0;
            this.memory.initialize();
        }
    }
}
</script>

<style>
.main-container {
    height: 100%;
}
.app-container {
    height: 90%;
    width: 100%;
    max-width: 1400px;
    padding-top: 1rem;
    padding-bottom: 1.5rem;
    margin-left: auto;
    margin-right: auto;
}
.control-container {
    align-items: center;
    width: 30%;
}
.button-container {
    justify-content: center;
    width: 100%;
    margin-bottom: 1rem;
}
.program-container {
    width: 85%;
    height: 100%;
    overflow-y: auto;
    border: solid 15px var(--mainColor);
    border-left-width: 3px;
    border-right-width: 3px;
    border-radius: 15px;
    background: var(--consoleColor);
}
.model-container {
    display: flex;
    align-items: center;
    width: 70%;
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
