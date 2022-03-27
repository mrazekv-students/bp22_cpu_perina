<!--
    Visual-only 'progress-bar' style connector
!-->

<template>
    <div class="connector" :style="connectorStyle">
        <div class="bar" :style="barStyle">
        </div>
    </div>
</template>

<script>
import Sleep from '@/scripts/Sleep.js'
export default {
    name: "Connector",
    emits: ["RegisterConnector"],

    props: {
        id: { type: Number, required: true },
        width: { type: Number, default: 4}
    },

    data() {
        return {
            connectorStyle: {
                width: this.width + 'rem'
            },
            barStyle: {
                width: '0rem',
                opacity: 1,
                'margin-left': 'initial'
            }
        }
    },

    created() {
        this.$emit("RegisterConnector", this.id, { fromCpuToMemory: this.FromCpuToMemory, fromMemoryToCpu: this.FromMemoryToCpu });
    },

    methods: {
        async FromCpuToMemory(fillTime, fadeTime) {
            // Fill from left to right
            this.ResetBar();
            this.barStyle['margin-left'] = 'initial';

            // Fill bar
            var i = 10;
            var fillBar = setInterval(() => {
                this.barStyle.width = ((i / fillTime) * this.width) + 'rem';
                i += 10;
            }, 10);
            await Sleep(fillTime).then(() => clearInterval(fillBar));

            // Fadeout
            var fadeOut = setInterval(() => {
                this.barStyle.opacity = i / fadeTime;
                i -= 10;
            }, 10);
            Sleep(fadeTime).then(() => clearInterval(fadeOut));
        },
        async FromMemoryToCpu(fillTime, fadeTime) {
            // Fill from right to left
            this.ResetBar();
            this.barStyle['margin-left'] = 'auto';

            // Fill bar
            var i = 10;
            var fillBar = setInterval(() => {
                this.barStyle.width = ((i / fillTime) * this.width) + 'rem';
                i += 10;
            }, 10);
            await Sleep(fillTime).then(() => clearInterval(fillBar));

            // Fadeout
            var fadeOut = setInterval(() => {
                this.barStyle.opacity = i / fadeTime;
                i -= 10;
            }, 10);
            Sleep(fadeTime).then(() => clearInterval(fadeOut));
        },
        ResetBar() {
            this.barStyle.width = '0rem';
            this.barStyle.opacity = 1;
        }
    }
}
</script>

<style>
.connector {
    height: 1rem;
    border-top: solid 5px var(--mainColor);
    border-bottom: solid 5px var(--mainColor);
    box-sizing: content-box;
    background: var(--mainColorDarkDark);
}
.connector + .connector {
    margin-top: 4rem;
}
.connector>.bar {
    height: 1rem;
    width: 1rem;
    background: var(--fontColor);
}
</style>
