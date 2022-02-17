<!--
    Visual-only component for RAM memory
!-->

<template>
    <table class="ram">
        <tr v-for="n in data.length" :key="n">
            <td class="ram-address"> {{ "0x" + (n - 1).toString(16).toUpperCase() }} </td>
            <td class="ram-value"> {{ data[n - 1] }} </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: "RamModel",

    props: {
        data: { type: Array, required: true }
    }
}
</script>

<style>
.ram {
    border: solid 2px;
    border-collapse: collapse;

    background: dimgray;
}
.ram td {
    border: solid 2px;
}

.ram-address {
    width: 3rem;
    text-align: center;
}
.ram-value {
    width: 6rem;
    padding-left: 0.2rem;
}
</style>