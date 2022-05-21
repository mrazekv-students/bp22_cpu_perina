<!--
    A register component with label and value
!-->

<template>
    <div class="register-label">
        <span v-show="label != null" class="title">{{ label }}</span>
        <div class="value">
            <div :style="highlightStyle">
                <span>{{ value }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RegisterLabel",
    emits: ["RegisterLabel"],

    props: {
        label: { type: String, default: null },
        value: { required: true },
        highlightColor: { type: String, default: "#8b161c" }
    },

    data() {
        return {
            highlightStyle: {
                background: this.highlightColor + "00"
            },
            fadeOut: { interval: null, timeout: null }
        }
    },

    created() {
        this.$emit("RegisterLabel", { highlight: this.Highlight});
    },

    methods: {
        Highlight(fadeTime = this.highlightFadeTime.value) {
            this.ResetIntervals();
            this.ResetHighlight();

            var i = fadeTime;
            var fadeHex;
            this.fadeOut.interval = setInterval(() => {
                fadeHex = (Math.floor((i / fadeTime) * 255)).toString(16).padStart(2, '0');
                this.highlightStyle.background = this.highlightColor + fadeHex;
                i -= 10;
            }, 10);
            this.fadeOut.timeout = setTimeout(() => {
                clearInterval(this.fadeOut.interval);
                this.fadeOut.interval = null;
                this.fadeOut.timeout = null;
            }, fadeTime);
        },
        ResetHighlight() {
            this.highlightStyle.background = this.highlightColor + "00";
        },
        ResetIntervals() {
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
.register-label {
    font-size: 1.2rem;
}
.register-label>.title {
    margin-right: 0.5rem;
    color: var(--fontColorFaded);
}
.register-label>.value {
    display: inline-block;
    min-width: 3em;
    border: solid 4px var(--mainColor);
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-radius: 5px;

    font-family: Consolas, Courier, monospace;
    background: var(--consoleColor);
}
.register-label>.value>div {
    padding: 0.2rem 0.5rem;
}
</style>
