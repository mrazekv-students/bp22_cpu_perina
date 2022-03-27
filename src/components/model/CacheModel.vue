<!--
    Visual-only component for cache
!-->

<template>
    <table class="cache">
        <tr>
            <th class="address"> Addr. </th>
            <th class="valid"> V </th>
            <th class="tag"> Tag </th>
            <th class="value"> Data </th>
        </tr>
        <tr v-for="n in data.length" :key="n">
            <td class="address" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ "0x" + (n - 1).toString(16).toUpperCase() }}
            </td>
            <td class="valid" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ data[n - 1].valid ? "T" : "F" }}
            </td>
            <td class="tag" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ "0x" + data[n - 1].tag.toString(16).toUpperCase() }}
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
    emits: ["RegisterCache"],

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
        this.$emit("RegisterCache", { highlight: this.HighlightRow })
    },

    methods: {
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
    max-height: 80%;
    border-top: solid 10px var(--mainColor);
    border-bottom: solid 10px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
    overflow: hidden;
    overflow-y: auto;
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
}
.cache td {
    padding: 0.1rem;
    border-left: solid 2px var(--mainColor);
}
.cache td:last-child {
    border-right: solid 2px var(--mainColor);
}

.cache td.address {
    width: 5rem;
    padding-right: 0.5rem;
    text-align: right;
    color: var(--fontColorFaded);
}
.cache td.valid {
    width: 2.5rem;
    text-align: center;
}
.cache td.tag {
    width: 5rem;
    text-align: center;
}
.cache td.value {
    width: 5rem;
    padding-left: 0.5rem;
}
</style>