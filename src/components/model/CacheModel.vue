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
                <span>{{ FormatAddressHex(n - 1) }}</span>
                <span>{{ FormatAddressBin(n - 1) }}</span>
            </td>
            <td :class="'valid ' + HighlightInvalid(data[n - 1].valid)" :style="highlightId == (n - 1) ? rowStyle : ''" @dblclick="ValidDblClick(n - 1)">
                {{ data[n - 1].valid ? "T" : "F" }}
            </td>
            <td class="tag" :style="highlightId == (n - 1) ? rowStyle : ''">
                <span>{{ FormatAddressHex(data[n - 1].tag, tagLength) }}</span>
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

    created() {
        this.$emit("RegisterCache", { highlight: this.HighlightRow }, this.id);
    },

    methods: {
        FormatAddressHex(address, tagLength) {
            var bitCount;
            if (typeof tagLength == "undefined") {
                bitCount = Math.log2(this.data.length) / 4;
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
            var bitCount;
            if (typeof tagLength == "undefined") {
                bitCount = Math.log2(this.data.length);
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

            return ` (${address.toString(2).padStart(bitCount, '0')})`;
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
    width: fit-content;
    min-width: 5rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    text-align: right;
    font-family: Consolas, Courier, monospace;
    color: var(--fontColorFaded);
}
.cache td.valid {
    width: 2.5rem;
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
    width: fit-content;
    min-width: 5rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    font-family: Consolas, Courier, monospace;
    text-align: center;
}
.cache td.value {
    width: 5rem;
    padding-left: 0.5rem;
}
</style>