<!--
    A processor cycle counter.
!-->

<template>
    <div class="vertical-container cycle-counter">
        <span class="cycle-label">Processor cycles:</span>
        <span class="cycle-value">{{ cycleCounterFormat }}</span>
    </div>
</template>

<script>
export default {
    name: "CycleCounter",
    
    data() {
        return {
            cycleCounter: 0 // TODO
        }
    },
    computed: {
        cycleCounterFormat() {
            return this.cycleCounter.toLocaleString(undefined)
        }
    }
}
</script>

<style>
.cycle-counter {
    align-items: center;
    margin-left: auto;
    padding-left: 1rem;
}
.cycle-counter .cycle-label {
    color: var(--fontColorFaded)
}
.cycle-counter .cycle-value {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 2.6rem;
    font-weight: bold;
}
</style>
