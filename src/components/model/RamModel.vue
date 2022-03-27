<!--
    Visual-only component for RAM memory
!-->

<template>
    <table class="ram">
        <tr>
            <th class="address"> Addr. </th>
            <th class="value"> Data </th>
        </tr>
        <tr v-for="n in data.length" :key="n">
            <td class="address" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ "0x" + (n - 1).toString(16).toUpperCase() }}
            </td>
            <td class="value" :style="highlightId == (n - 1) ? rowStyle : ''">
                {{ data[n - 1] }}
            </td>
        </tr>
    </table>
</template>

<script>
import Sleep from '@/scripts/Sleep.js'
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
                background: this.highlightColor + "ff",
            },
            highlightId: -1,
        }
    },

    created() {
        this.$emit("RegisterRam", { highlight: this.HighlightRow });
        console.log(this.highlightColor);
    },

    methods: {
        HighlightRow(id, fadeTime) {
            this.highlightId = id;

            var i = fadeTime;
            var fadeHex;
            var fadeOut = setInterval(() => {
                fadeHex = (Math.floor((i / fadeTime) * 255)).toString(16).padStart(2, '0');
                this.rowStyle.background = this.highlightColor + fadeHex;
                i -= 5;
            }, 5);
            Sleep(fadeTime).then(() => { 
                clearInterval(fadeOut);
                this.rowStyle.background = this.highlightColor + "00";
            });
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
    width: 5rem;
    padding-right: 0.5rem;
    text-align: right;
    color: var(--fontColorFaded);
}
.ram td.value {
    width: 5rem;
    padding-left: 0.5rem;
}
</style>