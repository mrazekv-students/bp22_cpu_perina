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
                            TODO: Assembler instruction
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
