<!--
    Visual-only 'progress-bar' style connector
!-->

<template>
    <div class="connector" :style="'width: ' + width + 'rem'">
        <div :class="'bar ' + barState"></div>
    </div>
</template>

<script>
import sleep from '@/scripts/Sleep.js'
export default {
    name: "Connector",
    emits: ["RegisterConnector"],

    props: {
        id: { type: Number, required: true },
        width: { type: Number, default: 4}
    },

    data() {
        return {
            barState: "bar-empty"
        }
    },

    created() {
        this.$emit("RegisterConnector", this.id, { fromCpuToMemory: this.FromCpuToMemory, fromMemoryToCpu: this.FromMemoryToCpu });
    },

    methods: {
        async FromCpuToMemory(delay) {
            this.barState = "bar-full bar-left";
            await sleep(delay);
            this.barState = "bar-fade bar-left";
        },
        async FromMemoryToCpu(delay) {
            this.barState = "bar-full bar-right";
            await sleep(delay);
            this.barState = "bar-fade bar-right";
        }
    }
}
</script>

<style>
.connector {
    width: 4rem;
    height: 2rem;
    border-top: solid 0.5rem var(--mainColor);
    border-bottom: solid 0.5rem var(--mainColor);
    background: var(--mainColorDarkDark);
}
.connector>.bar {
    height: 1rem;
    width: 1rem;
    transform: scaleX(0);
    background: var(--fontColor);
}
.connector>.bar-full {
    transform: scaleX(4);
    transition: transform .5s ease-in-out;
}
.connector>.bar-left {
    transform-origin: left;
}
.connector>.bar-right {
    transform-origin: right;
}
.connector>.bar-fade {
    opacity: 0%;
    transform: scaleX(0);
    transition: opacity .5s ease-in-out, transform 0s linear .4s;
}
</style>
