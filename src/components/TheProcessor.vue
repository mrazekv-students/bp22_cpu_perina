<!--
    The main component serving as core/processor of application
    Communicates with other components and runs simulation
    Contains application layout, most of general layouting should be done here
!-->

<template>
    <div class="horizontal-container app-container">
        <div class="vertical-container control-container">
            <div class="horizontal-container button-container">
                <icon-button v-for="button in controlButtons" :key="button"
                    :displayIcon="button.display" :function="button.function" :tooltip="button.tooltip"
                    :disabled="button.disabled" :visible="button.visible" class="control-button"/>
            </div>

            <div class="vertical-container program-container">
                <v-select class="program-select" v-model="selected" :options="programs" :label="'label'" :reduce="label => label.label" :disabled="hasStarted"
                    placeholder="Vyberte ukázkový program" @option:selected="SelectProgram" />
                <code-editor :selectedProgram="selectedProgram" :hasStarted="hasStarted" @RegisterCompiler="RegisterCompiler"/>
            </div>
        </div>

        <div class="vertical-container model-container">
            <the-tab-container @RegisterMemory="RegisterMemory" @RegisterRegs="RegisterRegs" :hasStarted="hasStarted"
                :instruction="instruction.instruction" :instructionPointer="instructionPointer"
                :accumulator="accumulator.value" :addressPointer="addressPointer.value"/>
        </div>
    </div>
</template>

<script>
const BUTTON = { FORWARD: "fastForward", START: "start", STOP: "stop", PAUSE: "pause", STEP: "step" };
const STATE = { STOPPED: "notStarted", STARTED: "started", HALTED: "halted" };


// Program select box: https://vue-select.org/
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { examplePrograms } from './codeEditor/ExamplePrograms.js';

import IconButton from './common/IconButton.vue';
import CodeEditor from './codeEditor/CodeEditor.vue';
import TheTabContainer from './TheTabContainer.vue';

import Cpu from '@/scripts/Cpu.js';
import ExecutionResult from '@/scripts/enums/ExecutionResult.js';
import Sleep from '@/scripts/Sleep.js';
export default {
    name: "TheLayout",
    components: { IconButton, CodeEditor, TheTabContainer, vSelect },

    computed: {
        hasStarted() { return this.currentState != STATE.STOPPED; }
    },

    data() {
        return {
            controlButtons: {
                fastForward: {
                    display: "fa-solid fa-forward",
                    function: this.FastForward,
                    tooltip: "Skip to next breakpoint",
                    disabled: false, visible: false
                },
                start: {
                    display: "fa-solid fa-play",
                    function: this.StartProgram,
                    tooltip: "Start program",
                    disabled: false, visible: true
                },
                stop: {
                    display: "fa-solid fa-stop",
                    function: this.StopProgram,
                    tooltip: "Stop program",
                    disabled: true, visible: true
                },
                pause: {
                    display: "fa-solid fa-pause",
                    function: this.PauseProgram,
                    tooltip: "Pause program execution",
                    disabled: true, visible: true
                },
                step: {
                    display: "fa-solid fa-forward-step",
                    function: this.ExecuteInstruction,
                    tooltip: "Execute next instruction",
                    disabled: false, visible: true
                }
            },
            compiler: { compile: null, getInstruction: null, getLabel: null, getNextLine: null, highlightLine: null },
            memory: { write: null, read: null, flush: null, initialize: null },
            regs: { highlightACC: null, highlightAP: null },
            cpu: null,
            currentState: STATE.STOPPED,

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
            if (this.currentState == STATE.STOPPED) {
                var compResult = this.CompileProgram();
                if (compResult) {
                    this.ChangeSimulationState(STATE.STOPPED);
                    return;
                }
            }
            this.ChangeSimulationState(STATE.STARTED);

            // Program loops
            while (this.currentState == STATE.STARTED) {
                await this.ExecuteInstruction();
                if (this.animations.enable) {
                    await Sleep(this.times.instructionWait);
                }
            }
        },
        StopProgram() {
            console.log("Stop program");
            this.ChangeSimulationState(STATE.STOPPED);
            this.Initialize();
        },
        PauseProgram() {
            console.log("Pause program");
            this.ChangeSimulationState(STATE.HALTED);
        },
        async ExecuteInstruction() {
            if (this.currentState == STATE.STOPPED) {
                var compResult = this.CompileProgram();
                if (compResult) {
                    this.ChangeSimulationState(STATE.STOPPED);
                    return;
                }

                this.ChangeSimulationState(STATE.HALTED)
            }

            try {
                // Disable step button until animation is finished
                if (this.currentState == STATE.HALTED) {
                    this.controlButtons[BUTTON.STEP].disabled = true;
                }

                // Execute instruction
                this.instruction = this.compiler.getInstruction(this.instructionPointer);
                var result = await this.cpu.execute(this.instruction);
                console.log(this.instruction);

                // Process result
                switch(result.result) {
                    case ExecutionResult.NextInstruction:
                        this.instructionPointer++;
                        break;
                    
                    case ExecutionResult.MoveToLabel:
                        this.instructionPointer = this.compiler.getLabel(result.label) + 1;
                        break;

                    case ExecutionResult.MoveToAddress:
                        this.instructionPointer = result.address;
                        break;

                    case ExecutionResult.HaltExecution:
                        console.log("Program stopped");
                        this.instructionPointer++;
                        this.ChangeSimulationState(STATE.HALTED);
                        break;

                    case ExecutionResult.EndExecution:
                        console.log("Program ended");
                        this.compiler.highlightLine(-1);
                        this.ChangeSimulationState(STATE.STOPPED);
                        return;

                    default:
                        throw Error("Unknown instruction result.");
                }

                this.compiler.highlightLine(this.compiler.getNextLine(this.instructionPointer));

                if (this.currentState == STATE.HALTED) {
                    this.controlButtons[BUTTON.STEP].disabled = false;
                }
            }
            catch (e) {
                this.$notify({
                    title: "Execution Error",
                    text: e.message,
                    type: "error"
                });
                console.error(e);
                this.ChangeSimulationState(STATE.STOPPED);
            }
        },
        FastForward() {
            this.animations.enable = false;
        },

        // Helper method to compile assembly program
        // Returns true if compilation error
        CompileProgram() {
            // Compile program
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
                return true;
            }

            // Create CPU
            this.Initialize();
            this.cpu = new Cpu(this.memory, this.accumulator, this.addressPointer, this.regs, this.cacheStats);
            this.compiler.highlightLine(this.compiler.getNextLine(this.instructionPointer));
            return false;
        },

        // Component registration methods
        RegisterCompiler(compiler) {
            this.compiler = compiler;
        },
        RegisterMemory(memory) {
            this.memory = memory;
        },
        RegisterRegs(regs) {
            this.regs = regs;
        },

        // Other methods
        ChangeSimulationState(state) {
            switch (state) {
                case STATE.STOPPED:
                    this.controlButtons[BUTTON.START].disabled = false;
                    this.controlButtons[BUTTON.STOP].disabled = true;
                    this.controlButtons[BUTTON.PAUSE].disabled = true;
                    this.controlButtons[BUTTON.STEP].disabled = false;

                    this.controlButtons[BUTTON.START].visible = true;
                    this.controlButtons[BUTTON.FORWARD].visible = false;
                    break;

                case STATE.STARTED:
                    this.controlButtons[BUTTON.START].disabled = true;
                    this.controlButtons[BUTTON.STOP].disabled = false;
                    this.controlButtons[BUTTON.PAUSE].disabled = false;
                    this.controlButtons[BUTTON.STEP].disabled = true;

                    this.controlButtons[BUTTON.START].visible = false;
                    this.controlButtons[BUTTON.FORWARD].visible = true;
                    break;

                case STATE.HALTED:
                    this.controlButtons[BUTTON.START].disabled = false;
                    this.controlButtons[BUTTON.STOP].disabled = false;
                    this.controlButtons[BUTTON.PAUSE].disabled = true;
                    this.controlButtons[BUTTON.STEP].disabled = false;

                    this.controlButtons[BUTTON.START].visible = true;
                    this.controlButtons[BUTTON.FORWARD].visible = false;
                    break;
            }

            this.animations.enable = true;
            this.currentState = state;
        },
        Initialize() {
            this.instructionPointer = 0;
            this.accumulator = { value: 0 };
            this.addressPointer = { value: 0 };
            this.instruction = { instruction: "INST" };
            this.cacheStats.cycles = 0;
            this.compiler.highlightLine(-1);
            this.memory.initialize();
        }
    }
}
</script>

<style>
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
