<!--
    Visual-only component for cache
    TODO: Add highlight check
!-->

<template>
    <table class="cache">
        <tr>
            <th v-tooltip="tooltips.address" class="address"> Address </th>
            <th v-tooltip="tooltips.dirtyBit" class="valid"> V </th>
            <th v-tooltip="tooltips.tag" class="tag"> Tag </th>
            <th v-tooltip="tooltips.data" class="value"> Data </th>
        </tr>
        <tr v-for="n in data.length" :key="n" :style="rowHighlightId == (n - 1) ? rowHighlightStyle : ''">
            <td class="address">
                <span class="hex">{{ FormatAddressHex((n - 1) * 4) }}</span>
                <span class="bin"> ({{ FormatAddressBin((n - 1) * 4) }})</span>
            </td>
            <td class="valid" :style="!data[n - 1].valid ? validFalseStyle : ''" @dblclick="ValidDblClick(n - 1)">
                {{ data[n - 1].valid ? "T" : "F" }}
            </td>
            <td class="tag" :style="tagHighlightId == (n - 1) ? tagHighlightStyle : ''">
                <span>{{ FormatAddressBin(data[n - 1].tag, tagLength) }}</span>
            </td>
            <td class="value">
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
    },

    data() {
        return {
            rowHighlightId: -1,
            rowHighlight: { interval: null, timeout: null},
            tagHighlightId: -1,
            tagHighlight: { interval: null, timeout: null},

            rowHighlightStyle: {
                'background': this.colors.secondaryColor + "00"
            },
            tagHighlightStyle: {
                'background': this.colors.infoColor + "00"
            },
            validFalseStyle: {
                'color': this.colors.secondaryColorLight,
                'font-weight': "bold"
            },

            tooltips: {
                address: "Memory block address",
                dirtyBit: { content: "<h4>Dirty bit</h4>Signals coherence of data in cache and RAM", html: true },
                tag: { content: "<h4>Memory block tag</h4>Value specifying RAM address", html: true },
                data: "Memory content",
            }
        }
    },

    computed: {
        dataLength() {
            return this.data.length * 4;
        }
    },

    created() {
        this.$emit("RegisterCache", { highlight: this.HighlightRow, highlightTag: this.HighlightTag }, this.id);
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

        ValidDblClick(row) {
            this.$emit("SwitchValidBit", row, this.id);
        },

        HighlightRow(id, fadeTime = this.times.highlightFade) {
            if (this.animations.enable) {
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
            }
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
        },

        // TODO: Add color coding
        async HighlightTag(id, fadeTime = this.times.highlightFade) {
            if (this.animations.enable) {
                this.ResetTagIntervals();
                this.ResetTagHighlight();
                this.tagHighlightId = id;

                var i = fadeTime;
                var fadeHex;
                this.tagHighlight.interval = setInterval(() => {
                    fadeHex = (Math.floor((i / fadeTime) * 255)).toString(16).padStart(2, '0');
                    this.tagHighlightStyle.background = this.colors.infoColor + fadeHex;
                    i -= 10;
                }, 10);
                var promise = new Promise((resolve) => {
                    this.tagHighlight.timeout = setTimeout(() => {
                        clearInterval(this.tagHighlight.interval);
                        this.tagHighlight.interval = null;
                        this.tagHighlight.timeout = null;

                        resolve();
                    }, fadeTime);
                });
                await promise;
            }
        },
        ResetTagIntervals() {
            if (this.tagHighlight.interval != null) {
                clearInterval(this.tagHighlight.interval);
                clearTimeout(this.tagHighlight.timeout);
                this.tagHighlight.interval = null;
                this.tagHighlight.timeout = null;
            }
        },
        ResetTagHighlight() {
            this.tagHighlightStyle.background = this.colors.infoColor + "00";
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
/* Source: https://stackoverflow.com/questions/28592053/multiple-background-color-layers */
.cache tr {
    position: relative;
}
.cache tr::before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--mainColorDark);
    z-index: -1;
}
.cache tr:nth-child(even)::before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--mainColorDarkDark);
    z-index: -1;
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
.cache td .bin {
    font-size: 0.8rem;
}
</style>