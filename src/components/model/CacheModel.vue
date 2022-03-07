<!--
    Visual-only component for cache
!-->

<template>
    <table class="cache">
        <tr v-for="n in data.length" :key="n">
            <td class="cache-address"> {{ "0x" + (n - 1).toString(16).toUpperCase() }} </td>
            <td class="cache-valid"> {{ data[n - 1].valid ? "T" : "F" }} </td>
            <td class="cache-tag"> {{ "0x" + data[n - 1].tag.toString(16).toUpperCase() }} </td>
            <td class="cache-value"> {{ data[n - 1].data }} </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: "CacheModel",

    props: {
        data: { type: Array, required: true }
    }
}
</script>

<style>
.cache {
    border: solid 2px;
    border-collapse: collapse;

    background: dimgray;
}
.cache td {
    border: solid 2px;
}

.cache-address {
    width: 3rem;
    text-align: center;
}
.cache-valid {
    width: 2rem;
    text-align: center;
}
.cache-tag {
    width: 3rem;
    text-align: center;
}
.cache-value {
    width: 6rem;
    padding-left: 0.2rem;
}
</style>