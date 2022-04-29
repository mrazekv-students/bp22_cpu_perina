<!--
    Edit settings window
    Source: https://vuejs.org/examples/#modal
!-->

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-wrapper">
                <div class="settings-container horizontal-container">
                    <div class="vertical-container">
                        <div class="settings-section">
                            <h2>Animation Settings</h2>
                            <number-input :label="'Instruction Interval:'" v-model.number="this.instructionWaitTime.value"/>
                            <number-input :label="'Connector Fill Time:'" v-model.number="this.connectorFillTime.value"/>
                            <number-input :label="'Connector Fade Time:'" v-model.number="this.connectorFadeTime.value"/>
                            <number-input :label="'Highlight Fade Time:'" v-model.number="this.highlightFadeTime.value"/>
                        </div>
                        <div class="settings-section">
                            <h2>Memory Cost Settings</h2>
                            <number-input :label="'Cache Check Cost:'" v-model.number="this.cycleCosts.cacheCheck"/>
                            <number-input :label="'Cache Access Cost:'" v-model.number="this.cycleCosts.cacheAccess"/>
                            <number-input :label="'RAM Access Cost:'" v-model.number="this.cycleCosts.ramAccess"/>
                        </div>
                        <div class="settings-section">
                            <h2>Memory Size Settings</h2>
                            <number-input :label="'RAM Size:'" v-model.number="this.memorySize.ram"/>
                            <number-input :label="'Cache Size:'" v-model.number="this.memorySize.cache"/>
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
    width: 420px;
    padding: 2rem;
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
