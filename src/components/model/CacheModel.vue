<!--
    Visual-only component for cache
!-->

<template>
    <table class="cache">
        <tr>
            <th class="address"> Address </th>
            <th class="valid"> V </th>
            <th class="tag"> Tag </th>
            <th class="value"> Data </th>
        </tr>
        <tr v-for="n in data.length" :key="n">
            <td class="address" :style="highlightId == (n - 1) ? rowStyle : ''">
                <span class="hex">{{ FormatAddressHex((n - 1) * 4) }}</span>
                <span class="bin"> ({{ FormatAddressBin((n - 1) * 4) }})</span>
            </td>
            <td :class="'valid ' + HighlightInvalid(data[n - 1].valid)" :style="highlightId == (n - 1) ? rowStyle : ''" @dblclick="ValidDblClick(n - 1)">
                {{ data[n - 1].valid ? "T" : "F" }}
            </td>
            <td class="tag" :style="highlightId == (n - 1) ? rowStyle : ''">
                <span>{{ FormatAddressBin(data[n - 1].tag, tagLength) }}</span>
            </td>
            <td class="value" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ data[n - 1].data }}
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: "CacheModel",
    emits: ["RegisterCache", "SwitchValidBit"],

    props: {
        id: { type: Number, default: 0 },
        data: { type: Array, required: true },
        tagLength: { type: Number, default: 1 },
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

    computed: {
        dataLength() {
            return this.data.length * 4;
        }
    },

    created() {
        this.$emit("RegisterCache", { highlight: this.HighlightRow }, this.id);
    },

    methods: {
        FormatAddressHex(address, tagLength) {
            // Source: https://stackoverflow.com/questions/42368797/how-can-i-convert-an-integer-to-hex-with-a-fix-length-in-javascript
            var bitCount;
            if (typeof tagLength == "undefined") {
                bitCount = Math.log2(this.dataLength) / 4;
            }
            else {
                bitCount = tagLength / 4;
            }
            
            if (bitCount % 1 == 0) {
                bitCount = Math.floor(bitCount);
            }
            else {
                bitCount = Math.floor(bitCount) + 1;
            }

            return `0x${address.toString(16).padStart(bitCount, '0').toUpperCase()}`;
        },
        FormatAddressBin(address, tagLength) {
            // Source: https://stackoverflow.com/questions/42368797/how-can-i-convert-an-integer-to-hex-with-a-fix-length-in-javascript
            var bitCount;
            if (typeof tagLength == "undefined") {
                bitCount = Math.log2(this.dataLength);
            }
            else {
                bitCount = tagLength;
            }

            if (bitCount % 1 == 0) {
                bitCount = Math.floor(bitCount);
            }
            else {
                bitCount = Math.floor(bitCount) + 1;
            }

            return `${address.toString(2).padStart(bitCount, '0')}`;
        },

        HighlightInvalid(valid) {
            if (valid) {
                return '';
            }
            else {
                return 'highlight';
            }
        },
        ValidDblClick(row) {
            this.$emit("SwitchValidBit", row, this.id);
        },

        HighlightRow(id, fadeTime) {
            this.ResetIntervals();
            this.ResetHighlight();
            this.highlightId = Math.floor(id / 4);

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
.cache {
    display: block;
    max-height: 45%;
    border-top: solid 10px var(--mainColor);
    border-bottom: solid 10px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
    white-space: nowrap;
    overflow: hidden;
    overflow-y: auto;
}
.cache::-webkit-scrollbar {
    background: var(--mainColor);
}
.cache + .cache {
    margin-top: 1rem;
}
.cache tr {
    background: var(--mainColorDark);
}
.cache tr:nth-child(even) {
    background: var(--mainColorDarkDark);
}

.cache th {
    padding: 0.1rem 0.5rem;
    font-weight: bold;
    text-transform: uppercase;
    background: var(--mainColor);
    position: sticky;
    top: 0;
}

.cache td {
    padding: 0.1rem;
    border-left: solid 2px var(--mainColor);
}
.cache td:last-child {
    border-right: solid 2px var(--mainColor);
}

.cache td.address {
    padding: 0.1rem 0.3rem;
    text-align: right;
    font-family: Consolas, Courier, monospace;
    color: var(--fontColorFaded);
}
.cache td.valid {
    width: 2rem;
    text-align: center;
    user-select: none;
}
.cache td.valid.highlight {
    color: var(--secondaryColorLight);
    font-weight: bold;
}
.cache td.valid:hover {
    cursor: pointer;
}
.cache td.tag {
    padding: 0.1rem 0.4rem;
    font-family: Consolas, Courier, monospace;
    text-align: center;
}
.cache td.value {
    padding: 0.1rem 0.4rem;
    text-align: center;
}
.cache .bin {
    font-size: 0.8rem;
}
</style>