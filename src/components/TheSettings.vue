<!--
    Edit settings window
!-->

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-wrapper">
                <div class="settings-container horizontal-container">
                    <div class="vertical-container">
                        <div class="settings-section">
                            <h2>Animation Settings</h2>
                            <number-input :label="'Instruction Interval:'" v-model.number="this.instructionWaitTime"/>
                            <number-input :label="'Connector Fill Time:'" v-model.number="this.connectorFillTime"/>
                            <number-input :label="'Connector Fade Time:'" v-model.number="this.connectorFadeTime"/>
                            <number-input :label="'Highlight Fade Time:'" v-model.number="this.highlightFadeTime"/>
                        </div>
                        <div class="settings-section">
                            <h2>Cycle Cost Settings</h2>
                        </div>
                    </div>
                    <icon-button :displayIcon="'fa-solid fa-xmark'" :function="CloseSetting" class="close-button"/>
                </div>
            </div>
        </div>
  </Transition>
</template>

<script>
import IconButton from './common/IconButton.vue'
import NumberInput from './common/NumberInput.vue'
export default {
    name: "TheSettings",
    components: { IconButton, NumberInput },

    props: {
        show: { type: Boolean, required: true }
    },

    methods: {
        CloseSetting() {
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
.settings-container {
    width: 400px;
    padding: 30px;
    border-radius: 10px;
    background-color: var(--backgroundColor);
    transition: all 0.3s ease;
}
.settings-section {
    margin-right: 0.8rem;
}
.settings-section + .settings-section {
    margin-top: 1rem;
}

.settings-container>.close-button {
    width: 2rem;
    height: 2rem;
    margin-left: auto;
    border-radius: 5px;
    font-size: 1.5rem;
}

.settings-section>h2 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    text-transform: uppercase;
    color: var(--mainColor);
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
