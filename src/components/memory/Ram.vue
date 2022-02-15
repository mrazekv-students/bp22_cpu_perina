<!--
    Ram memory
!-->

<template>
    <table class="ram">
        <tr v-for="n in (data.length - 1)" :key="n">
            <td> {{ "0x" + (n - 1).toString(16).toUpperCase() }} </td>
            <td> {{ data[n - 1] }} </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: "RamSegment",

    props: {
        data: { type: Array, required: true }
    }
}
</script>

<style>
.ram {
    border: solid 2px;
    border-collapse: collapse;

    background: green;
}
.ram td {
    border: solid 2px;
}
</style>