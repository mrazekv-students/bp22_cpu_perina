<!--
    About window
    Source: https://vuejs.org/examples/#modal
!-->

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-wrapper">
                <div class="about-container horizontal-container">
                    <div class="vertical-container">
                        <h1>Cache Simulator</h1>
                        <p>
                            TODO: Basic info about application
                        </p>
                        <h2>Controls</h2>
                        <p>
                            TODO: Describe how to control application
                        </p>
                        <h2>Usage</h2>
                        <p>
                            TODO: Describe basic use cases and thing that can be done with application
                        </p>
                        <h2>Assembler</h2>
                        <p>
                            Used assembler was based on assembler intruduced in lab 4: Implementation of procesor in VHDL, course Design of Computer Systems, FIT BUT. 
                            All usable instructions and their description can be seen at <a href="https://github.com/mrazekv-students/bp22_cpu_perina/issues/3">github</a> or in the table below.
                        </p>
                        <table>
                            <tr><th>Instruction</th><th>Description</th></tr>
                            <tr><td>HALT</td><td>Stops program execution at this position.</td></tr>
                            <tr><td>NEGATE</td><td>Negates value in accumulator register.</td></tr>
                            <tr><td>ACCDEC</td><td>Increment value in accumulator by one.</td></tr>
                            <tr><td>ACCINC</td><td>Decrement value in accumulator by one.</td></tr>
                            <tr><td>NOP</td><td>No operation.</td></tr>
                            <tr><td>OUTP</td><td>No operation.</td></tr>
                            <tr><td>INP</td><td>Sets value in accumulator to random value in range 0-1023.</td></tr>
                            <tr><td>MLOAD [value]</td><td>Loads value to accumulator.</td></tr>
                            <tr><td>DLOAD @[address]</td><td>Loads value at entered memory address to accumulator.</td></tr>
                            <tr><td>ILOAD @[address]</td><td>Loads value at memory address determined by value stored at entered memory address to accumulator.</td></tr>
                            <tr><td>DSTORE @[address]</td><td>Stores value in accumulator to entered memory address.</td></tr>
                            <tr><td>ISTORE @[address]</td><td>Stores value in accumulator to memory address determined by value of entered memory address.</td></tr>
                            <tr><td>BRANCH [label]</td><td>Moves program execution to position marked by entered label.</td></tr>
                            <tr><td>BRZERO [label]</td><td>Moves program execution to position marked by entered label if value in accumulator is equal to zero.</td></tr>
                            <tr><td>BRPOS [label]</td><td>Moves program execution to position marked by entered label if value in accumulator is greater than zero.</td></tr>
                            <tr><td>BRNEG [label]</td><td>Moves program execution to position marked by entered label if value in accumulator is lesser than zero.</td></tr>
                            <tr><td>MADD @[address]</td><td>Adds value at entered memory address to value in accumulator.</td></tr>
                            <tr><td>IJUMP @[address]</td><td>Indirect jump to address in code stored in entered memory address.</td></tr>
                            <tr><td>FLUSH</td><td>Flushes contents of cache to main memory and resets CPU cycle counter.</td></tr>
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
