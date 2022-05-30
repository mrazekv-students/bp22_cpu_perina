<!--
    Visual-only component for RAM memory
!-->

<template>
    <table class="ram">
        <tr>
            <th class="address"> Address </th>
            <th class="value"> Data </th>
        </tr>
        <tr v-for="n in data.length" :key="n" :style="rowHighlightId == (n - 1) ? rowHighlightStyle : ''">
            <td class="address">
                <span class="hex">{{ FormatAddressHex((n - 1) * 4) }}</span>
                <span class="bin"> ({{ FormatAddressBin((n - 1) * 4) }})</span>
            </td>
            <td class="value">
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
    },

    data() {
        return {
            rowHighlightStyle: {
                'background': this.colors.secondaryColor + "00"
            },
            rowHighlightId: -1,
            rowHighlight: { interval: null, timeout: null},
        }
    },

    computed: {
        dataLength() {
            return this.data.length * 4;
        }
    },

    created() {
        this.$emit("RegisterRam", { highlight: this.HighlightRow });
    },

    methods: {
        FormatAddressHex(address) {
            // Source: https://stackoverflow.com/questions/42368797/how-can-i-convert-an-integer-to-hex-with-a-fix-length-in-javascript
            var bitCount = Math.log2(this.dataLength) / 4;
            if (bitCount % 1 == 0) {
                bitCount = Math.floor(bitCount);
            }
            else {
                bitCount = Math.floor(bitCount) + 1;
            }

            return `0x${address.toString(16).padStart(bitCount, '0').toUpperCase()}`;
        },
        FormatAddressBin(address) {
            // Source: https://stackoverflow.com/questions/42368797/how-can-i-convert-an-integer-to-hex-with-a-fix-length-in-javascript
            var bitCount = Math.log2(this.dataLength);
            if (bitCount % 1 == 0) {
                bitCount = Math.floor(bitCount);
            }
            else {
                bitCount = Math.floor(bitCount) + 1;
            }

            return `${address.toString(2).padStart(bitCount, '0')}`;
        },

        HighlightRow(id, fadeTime = this.times.highlightFade) {
            this.ResetRowIntervals();
            this.ResetRowHighlight();
            this.rowHighlightId = Math.floor(id / 4);

            var i = fadeTime;
            var fadeHex;
            this.rowHighlight.interval = setInterval(() => {
                fadeHex = (Math.floor((i / fadeTime) * 255)).toString(16).padStart(2, '0');
                this.rowHighlightStyle.background = this.colors.secondaryColor + fadeHex;
                i -= 10;
            }, 10);
            this.rowHighlight.timeout = setTimeout(() => {
                clearInterval(this.rowHighlight.interval);
                this.rowHighlight.interval = null;
                this.rowHighlight.timeout = null;
            }, fadeTime);
        },
        ResetRowIntervals() {
            if (this.rowHighlight.interval != null) {
                clearInterval(this.rowHighlight.interval);
                clearTimeout(this.rowHighlight.timeout);
                this.rowHighlight.interval = null;
                this.rowHighlight.timeout = null;
            }
        },
        ResetRowHighlight() {
            this.rowHighlightStyle.background = this.colors.secondaryColor + "00";
        }
    }
}
</script>

<style>
.ram {
    display: block;
    max-height: 90%;
    border-top: solid 10px var(--mainColor);
    border-bottom: solid 10px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
    white-space: nowrap;
    overflow: hidden;
    overflow-y: auto;
}
.ram::-webkit-scrollbar {
    background: var(--mainColor);
}
/* Source: https://stackoverflow.com/questions/28592053/multiple-background-color-layers */
.ram tr {
    position: relative;
}
.ram tr::before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--mainColorDark);
    z-index: -1;
}
.ram tr:nth-child(even)::before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--mainColorDarkDark);
    z-index: -1;
}

.ram th {
    padding: 0.1rem 0.5rem;
    font-weight: bold;
    text-transform: uppercase;
    background: var(--mainColor);
    position: sticky;
    top: 0;
}

.ram td {
    padding: 0.1rem;
    border-left: solid 2px var(--mainColor);
}
.ram td + td {
    border-right: solid 2px var(--mainColor);
}

.ram td.address {
    padding: 0.1rem 0.4rem;
    text-align: right;
    font-family: Consolas, Courier, monospace;
    color: var(--fontColorFaded);
}
.ram td.value {
    padding: 0.1rem 0.4rem;
    text-align: center;
}
.ram .bin {
    font-size: 0.75rem;
}
</style>