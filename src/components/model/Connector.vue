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
            },
            fillBar: { interval: null, timeout: null },
            fadeOut: { interval: null, timeout: null }
        }
    },

    created() {
        this.$emit("RegisterConnector", this.id, { fromCpuToMemory: this.FromCpuToMemory, fromMemoryToCpu: this.FromMemoryToCpu });
    },

    methods: {
        async FromCpuToMemory(fillTime, fadeTime) {
            // Fill from left to right
            this.ResetIntervals();
            this.ResetBar("initial");
            await this.AnimateBar(fillTime, fadeTime);
        },
        async FromMemoryToCpu(fillTime, fadeTime) {
            // Fill from right to left
            this.ResetIntervals();
            this.ResetBar("auto");
            await this.AnimateBar(fillTime, fadeTime);
        },
        async AnimateBar(fillTime, fadeTime) {
            // Fill bar
            var i = 10;
            this.fillBar.interval = setInterval(() => {
                this.barStyle.width = ((i / fillTime) * this.width) + 'rem';
                i += 10;
            }, 10);
            var promise = new Promise((resolve) => {
                this.fillBar.timeout = setTimeout(() => {
                    clearInterval(this.fillBar.interval);
                    this.fillBar.interval = null;
                    this.fillBar.timeout = null;

                    resolve();
                }, fillTime);
            });
            await promise;

            // Fadeout
            this.fadeOut.interval = setInterval(() => {
                this.barStyle.opacity = i / fadeTime;
                i -= 10;
            }, 10);
            this.fadeOut.timeout = setTimeout(() => {
                clearInterval(this.fadeOut.interval);
                this.fadeOut.interval = null;
                this.fadeOut.timeout = null;
            }, fadeTime);
        },
        ResetBar(alignment) {
            this.barStyle.width = '0rem';
            this.barStyle.opacity = 1;
            this.barStyle['margin-left'] = alignment;
        },
        ResetIntervals() {
            if (this.fillBar.interval != null) {
                clearInterval(this.fillBar.interval);
                clearTimeout(this.fillBar.timeout)
                this.fillBar.interval = null;
                this.fillBar.timeout = null;
            }
            if (this.fadeOut.interval != null) {
                clearInterval(this.fadeOut.interval);
                clearTimeout(this.fadeOut.timeout);
                this.fadeOut.interval = null;
                this.fadeOut.timeout = null;
            }
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
