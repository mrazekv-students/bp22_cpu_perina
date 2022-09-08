<!--
    A cache statistics (CPU cycles, memory access counter...) component
!-->

<template>
    <div class="vertical-container cache-stats">
        <div class="vertical-container cycle-counter">
            <span class="stats-label">CPU cycles</span>
            <span class="stats-value">{{ cycleCounterFormat }}</span>
        </div>
        <div class="vertical-container memory-stats">
            <div class="horizontal-container">
                <span class="stats-label">Memory accesses:</span>
                <span class="stats-value">{{ memoryAccessesFormat }}</span>
            </div>
            <div class="horizontal-container">
                <span class="stats-label">Cache hits:</span>
                <span class="stats-value">{{ cacheHitsFormat }}</span>
                <span class="stats-value">({{ cacheHitsPercentFormat }}%)</span>
            </div>
            <div class="horizontal-container">
                <span class="stats-label">Cache misses:</span>
                <span class="stats-value">{{ cacheMissesFormat }}</span>
                <span class="stats-value">({{ cacheMissesPercentFormat }}%)</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CacheStats",

    props: {
        cycles: { required: true },
        memoryAccesses: { required: true },
        cacheHits: { required: true },
        cacheMisses: {required: true }
    },
    
    computed: {
        cycleCounterFormat() {
            return this.cycles.toLocaleString();
        },
        memoryAccessesFormat() {
            return this.memoryAccesses.toLocaleString();
        },
        cacheHitsFormat() {
            return this.cacheHits.toLocaleString();
        },
        cacheHitsPercentFormat() {
            return ((this.cacheHits / this.memoryAccesses) * 100).toPrecision(2);
        },
        cacheMissesFormat() {
            return this.cacheMisses.toLocaleString();
        },
        cacheMissesPercentFormat() {
            return ((this.cacheMisses / this.memoryAccesses) * 100).toPrecision(2);
        }
    }
}
</script>

<style>
.cache-stats {
    width: 100%;
    padding-top: 0.6rem;
    margin-top: 0.6rem;
    border-top: solid 2px var(--mainColor);
    justify-content: space-between;
}
.stats-label {
    color: var(--fontColorFaded)
}
.stats-value {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 2.6rem;
    font-weight: bold;
}

.cycle-counter {
    align-items: center;
    margin-bottom: 0.5rem;
}
.cycle-counter .stats-label {
    text-align: center;
}

.memory-stats .horizontal-container {
    margin-bottom: 0.25rem;
}
.memory-stats .stats-value {
    margin-left: auto;
    font-size: 1rem;
}
.memory-stats .stats-value + .stats-value {
    margin-left: 0.4rem;
}
</style>
