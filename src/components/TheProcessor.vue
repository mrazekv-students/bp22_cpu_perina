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

                <div class="vertical-container program-container">
                    <v-select class="program-select" v-model="selected" :options="programs" :label="'label'" :reduce="label => label.label" :disabled="hasStarted"
                        placeholder="Vyberte ukázkový program" @option:selected="SelectProgram" />
                    <code-editor :selectedProgram="selectedProgram" :hasStarted="hasStarted" @RegisterCompiler="RegisterCompiler"/>
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

// Program select box: https://vue-select.org/
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { examplePrograms } from './codeEditor/ExamplePrograms.js';

import IconButton from './common/IconButton.vue';
import CodeEditor from './codeEditor/CodeEditor.vue';
import TheTabContainer from './TheTabContainer.vue';
import TheTitle from './TheTitle.vue';

import Cpu from '@/scripts/Cpu.js';
import ExecutionResult from '@/scripts/enums/ExecutionResult.js';
import Sleep from '@/scripts/Sleep.js';
export default {
    name: "TheLayout",
    components: { IconButton, CodeEditor, TheTabContainer, TheTitle, vSelect },

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

            programs: examplePrograms,
            selected: examplePrograms[0].label,
            selectedProgram: examplePrograms[0].code
        }
    },

    methods: {
        SelectProgram(program) {
            console.log(program);
            this.selectedProgram = program.code
        },

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
                    this.$notify({
                        title: "Compilation Error",
                        text: e.message,
                        type: "error"
                    });
                    console.error(e);
                    return;
                }

                // Create CPU
                this.Initialize();
                this.cpu = new Cpu(this.memory, this.accumulator, this.addressPointer, this.cycleCounter);
            }

            this.ChangeSimulationState(s_started);
            this.compiler.highlightLine(this.compiler.getNextLine(this.instructionPointer));

            // Program loops
            while (this.currentState == s_started) {
                await this.ExecuteInstruction();
                await Sleep(this.instructionWaitTime.value);
            }
        },
        StopProgram() {
            console.log("Stop program");
            this.ChangeSimulationState(s_notStarted);
            this.Initialize();
        },
        PauseProgram() {
            console.log("Pause program");
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
                    return;
                }

                this.compiler.highlightLine(this.compiler.getNextLine(this.instructionPointer));

                if (this.currentState == s_halted) {
                    this.controlButtons[3].disabled = false;
                }
            }
            catch (e) {
                this.$notify({
                    title: "Execution Error",
                    text: e.message,
                    type: "error"
                });
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
            this.compiler.highlightLine(-1);
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
    padding-bottom: 1rem;
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
    width: 90%;
    height: 100%;
    overflow-y: hidden;

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

.program-select {
    --vs-controls-color: var(--mainColor);
    --vs-border-color: var(--mainColor);
    --vs-dropdown-bg: var(--backgroundColor);
    --vs-dropdown-color: var(--fontColorFaded);
    --vs-dropdown-option-color: var(--fontColorFaded);
    --vs-selected-bg: var(--mainColor);
    --vs-selected-color: var(--fontColor);
    --vs-search-input-color: var(--fontColorFaded);
    --vs-dropdown-option--active-bg: var(--mainColor);
    --vs-dropdown-option--active-color: var(--fontColor);
    --vs-disabled-bg: var(--backgroundColor);
}
.program-select .vs__search::placeholder,
.program-select .vs__dropdown-toggle,
.program-select .vs__dropdown-menu {
    border: none;
    border-radius: 0;
    font-weight: bold;
    background: var(--backgroundColor);
}
.program-select .vs__dropdown-toggle {
    border-bottom: solid 3px var(--mainColor);
}
.program-select .vs__dropdown-menu {
    border-top: solid 1px var(--mainColor);
    border-bottom: solid 3px var(--mainColor);
}
</style>
