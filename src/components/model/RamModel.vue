<!--
    Visual-only component for RAM memory
!-->

<template>
    <table class="ram">
        <tr>
            <th class="address"> Address </th>
            <th class="value"> Data </th>
        </tr>
        <tr v-for="n in data.length" :key="n">
            <td class="address" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ FormatAddress(n - 1) }}
            </td>
            <td class="value" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ data[n - 1] }}
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: "RamModel",
    emits: ["RegisterRam"],

    props: {
        data: { type: Array, required: true },
        highlightColor: { type: String, default: "#8b161c" }
    },

    data() {
        return {
            rowStyle: {
                background: this.highlightColor + "00"
            },
            highlightId: -1,
            fadeOut: { interval: null, timeout: null},
        }
    },

    created() {
        this.$emit("RegisterRam", { highlight: this.HighlightRow });
    },

    methods: {
        FormatAddress(address) {
            var bitCount = Math.floor(Math.log2(this.data.length + 1));

            var string = `0x${address.toString(16).padStart(bitCount / 4, '0').toUpperCase()}`;
            string += ` (${address.toString(2).padStart(bitCount, '0')})`;
            return string;
        },

        HighlightRow(id, fadeTime) {
            this.ResetIntervals();
            this.ResetHighlight();
            this.highlightId = id;

            var i = fadeTime;
            var fadeHex;
            this.fadeOut.interval = setInterval(() => {
                fadeHex = (Math.floor((i / fadeTime) * 255)).toString(16).padStart(2, '0');
                this.rowStyle.background = this.highlightColor + fadeHex;
                i -= 10;
            }, 10);
            this.fadeOut.timeout = setTimeout(() => {
                clearInterval(this.fadeOut.interval);
                this.fadeOut.interval = null;
                this.fadeOut.timeout = null;
            }, fadeTime);
        },
        ResetHighlight() {
            this.rowStyle.background = this.highlightColor + "00";
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
.ram {
    max-height: 80%;
    border-top: solid 10px var(--mainColor);
    border-bottom: solid 10px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
    overflow: hidden;
    overflow-y: auto;
}
.ram tr {
    background: var(--mainColorDark);
}
.ram tr:nth-child(even) {
    background: var(--mainColorDarkDark);
}
.ram th {
    padding: 0.1rem 0.5rem;
    font-weight: bold;
    text-transform: uppercase;
    background: var(--mainColor);
}
.ram td {
    padding: 0.1rem;
    border-left: solid 2px var(--mainColor);
}
.ram td + td {
    border-right: solid 2px var(--mainColor);
}

.ram td.address {
    width: fit-content;
    min-width: 5rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    text-align: right;
    font-family: Consolas, Courier, monospace;
    color: var(--fontColorFaded);
}
.ram td.value {
    width: 5rem;
    padding-left: 0.5rem;
}
</style>