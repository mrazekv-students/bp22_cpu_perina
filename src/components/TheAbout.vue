<!--
    About window
    Source: https://vuejs.org/examples/#modal
!-->

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-wrapper">
                <div class="about-container horizontal-container">
                    <div class="about-content vertical-container">
                        <h2>Cache Simulator</h2>
                        <p>
                            The Cache Simulator is a simple website application for simulating and displaying function of caches in CPU.
                            CPU caches are small but fast memory storages that serve as a buffer between fast procesor and significantly slower RAM memory.
                            In this application, user can input random program written in assembler (see below for instruction list) and simulate its execution and flow of data between CPU, cache and RAM.
                            That way user can test various different architectures of cache, their influence on various programs and see why it is important to take cache structure into account when programming performant code.
                        </p>
                        <p>
                            The application contains several pre-prepared example programs demonstrating common problems with some cache architectures and/or bad programming practices.
                            For evaluation of their properties see the animated flow of data between CPU, cache and RAM and also the execution statistics: CPU cycles needed to execute program and rates of cache hit or cache miss.
                        </p>
                        <h3>Controls</h3>
                        <p>
                            The application consists of two parts.
                            On the left are program control buttons and a code editor.
                            At the top of the code editor is a selection box containing pre-prepared example programs.
                            These program show various interesting properties of caches and can be freely edited (the changes are not saved).
                        </p>
                        <p>
                            Once the desired program is entered the simulation can be started by either clicking the <b>START</b> button or the <b>STEP</b> button.
                            Running program can be paused by clicking the <b>PAUSE</b> button and ended using the <b>STOP</b> button.
                            Actively running program can also be fast-forwarded by clicking the <b>FAST FORWARD</b> button in place of the <b>START</b> button.
                        </p>
                        <p>
                            On the right side are CPU and memory visual models.
                            The application supports 4 cache models: no cache, directly mapped cache, two-way cache and full cache.
                            User can change currently selected cache model by clicking the appropriate tab. 
                            Selected cache model can only be changed when the program is neither running or paused.
                        </p>
                        <p>
                            At the far right of the title bar is a settings button which shows the settings dialog.
                            Here user can change size of both cache memory and RAM memory, CPU costs of accessing both and speed of animations.
                        </p>
                        <h3>Assembler</h3>
                        <p>
                            Used assembler was based on assembler intruduced in lab 4: Implementation of procesor in VHDL, course Design of Computer Systems, FIT BUT. 
                            All usable instructions and their description can be seen at <a href="https://github.com/mrazekv-students/bp22_cpu_perina/issues/3">github</a> or in the table below:
                        </p>
                        <table>
                            <tr><th>Instruction</th><th>Description</th></tr>
                            <tr><td class="instruction">HALT</td><td class="description">Stops program execution at this position.</td></tr>
                            <tr><td class="instruction">NEGATE</td><td class="description">Negates value in accumulator register.</td></tr>
                            <tr><td class="instruction">ACCDEC</td><td class="description">Increments value in accumulator by one.</td></tr>
                            <tr><td class="instruction">ACCINC</td><td class="description">Decrements value in accumulator by one.</td></tr>
                            <tr><td class="instruction">NOP</td><td class="description">No operation.</td></tr>
                            <tr><td class="instruction">OUTP</td><td class="description">No operation (originally I/O instruction).</td></tr>
                            <tr><td class="instruction">INP</td><td class="description">Sets value in accumulator to random value in range 0-1023 (originally I/O instruction).</td></tr>
                            <tr><td class="instruction">MLOAD [value]</td><td class="description">Loads value to accumulator.</td></tr>
                            <tr><td class="instruction">DLOAD @[address]</td><td class="description">Loads value located at entered memory address to accumulator.</td></tr>
                            <tr><td class="instruction">ILOAD @[address]</td><td class="description">Loads value located at memory address determined by value stored at entered memory address to accumulator.</td></tr>
                            <tr><td class="instruction">DSTORE @[address]</td><td class="description">Stores value in accumulator to entered memory address.</td></tr>
                            <tr><td class="instruction">ISTORE @[address]</td><td class="description">Stores value in accumulator to memory address determined by value of entered memory address.</td></tr>
                            <tr><td class="instruction">BRANCH [label]</td><td class="description">Moves program execution to position marked by entered label.</td></tr>
                            <tr><td class="instruction">BRZERO [label]</td><td class="description">Moves program execution to position marked by entered label if value in accumulator is equal to zero.</td></tr>
                            <tr><td class="instruction">BRPOS [label]</td><td class="description">Moves program execution to position marked by entered label if value in accumulator is greater than zero.</td></tr>
                            <tr><td class="instruction">BRNEG [label]</td><td class="description">Moves program execution to position marked by entered label if value in accumulator is lesser than zero.</td></tr>
                            <tr><td class="instruction">MADD @[address]</td><td class="description">Adds value at entered memory address to value in accumulator.</td></tr>
                            <tr><td class="instruction">IJUMP @[address]</td><td class="description">Indirect jump to address in code stored in entered memory address.</td></tr>
                            <tr><td class="instruction">FLUSH</td><td class="description">Flushes contents of cache to main memory and resets CPU cycle counter.</td></tr>
                        </table>
                        <p>
                            Instruction names are case-insensitive.
                            Value parameters are signed integers written in decimal notation.
                            Address parameters are written in hexadecimal notation with at-sign ('@') prefix.
                            Label are case-sensitive alfanumeric strings that are not equal to instruction name and ends with colon (':').
                            Labels parameters are written without the colon.
                        </p>
                    </div>
                    <icon-button :displayIcon="'fa-solid fa-xmark'" :function="CloseAbout" class="close-button"/>
                </div>
            </div>
        </div>
  </Transition>
</template>

<script>
import IconButton from './common/IconButton.vue'
export default {
    name: "TheAbout",
    components: { IconButton },

    props: {
        show: { type: Boolean, required: true }
    },

    methods: {
        CloseAbout() {
            this.$emit("close");
        }
    }
}
</script>

<style>
.modal-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9998;
    top: 0;
    left: 0;
    background-color: #000000AA;
    transition: opacity 0.3s ease;
}
.modal-wrapper {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
}
.about-container {
    width: 820px;
    max-height: 90vh;
    padding: 2rem;
    border-radius: 10px;
    background-color: var(--backgroundColor);
    transition: all 0.3s ease;
}

.about-content {
    width: 95%;
    overflow-y: auto;
}
.about-content h2 {
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
    text-transform: uppercase;
    color: var(--mainColor);
}
.about-content h3 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    color: var(--fontColor);
}
.about-content p {
    width: 98%;
    margin-bottom: 1.0rem;
    text-align: justify;
}

.about-content table {
    width: 98%;
    border-top: solid 10px var(--mainColor);
    border-bottom: solid 10px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
    margin-bottom: 1.0rem;
}
.about-content table th {
    padding: 0.2rem 0.5rem;
    font-weight: bold;
    text-transform: uppercase;
    background: var(--mainColor);
}
.about-content table tr:nth-child(even) {
    background: var(--mainColorDarkDark);
}
.about-content table tr:nth-child(odd) {
    background: var(--mainColorDark);
}
.about-content table td {
    padding: 0.15rem 0.4rem;
    border-left: solid 2px var(--mainColor);
}
.about-content table td:last-child {
    border-right: solid 2px var(--mainColor);
}
.about-content table .instruction {
    min-width: 200px;
    font-weight: bold;
}


/* Animation */
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
