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
                            TODO: Basic info about application
                        </p>
                        <h3>Controls</h3>
                        <p>
                            TODO: Describe how to control application
                        </p>
                        <h3>Usage</h3>
                        <p>
                            TODO: Describe basic use cases and thing that can be done with application
                        </p>
                        <h3>Assembler</h3>
                        <p>
                            Used assembler was based on assembler intruduced in lab 4: Implementation of procesor in VHDL, course Design of Computer Systems, FIT BUT. 
                            All usable instructions and their description can be seen at <a href="https://github.com/mrazekv-students/bp22_cpu_perina/issues/3">github</a> or in the table below.
                        </p>
                        <table>
                            <tr><th>Instruction</th><th>Description</th></tr>
                            <tr><td class="instruction">HALT</td><td class="description">Stops program execution at this position.</td></tr>
                            <tr><td class="instruction">NEGATE</td><td class="description">Negates value in accumulator register.</td></tr>
                            <tr><td class="instruction">ACCDEC</td><td class="description">Increment value in accumulator by one.</td></tr>
                            <tr><td class="instruction">ACCINC</td><td class="description">Decrement value in accumulator by one.</td></tr>
                            <tr><td class="instruction">NOP</td><td class="description">No operation.</td></tr>
                            <tr><td class="instruction">OUTP</td><td class="description">No operation.</td></tr>
                            <tr><td class="instruction">INP</td><td class="description">Sets value in accumulator to random value in range 0-1023.</td></tr>
                            <tr><td class="instruction">MLOAD [value]</td><td class="description">Loads value to accumulator.</td></tr>
                            <tr><td class="instruction">DLOAD @[address]</td><td class="description">Loads value at entered memory address to accumulator.</td></tr>
                            <tr><td class="instruction">ILOAD @[address]</td><td class="description">Loads value at memory address determined by value stored at entered memory address to accumulator.</td></tr>
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
    margin-bottom: 1.0rem;
}

.about-content table {
    width: 98%;
    border-top: solid 10px var(--mainColor);
    border-bottom: solid 10px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
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
