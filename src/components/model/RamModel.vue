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
            <td class="address"> {{ "0x" + (n - 1).toString(16).toUpperCase() }} </td>
            <td class="value"> {{ data[n - 1] }} </td>
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
    margin-top: 1rem;
    border-top: solid 8px var(--mainColor);
    border-bottom: solid 8px var(--mainColor);
    border-radius: 10px;
    border-spacing: 0;
    overflow: hidden;
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
    width: 6rem;
    padding-right: 0.5rem;
    text-align: right;
    color: var(--fontColorFaded);
}
.ram td.value {
    width: 6rem;
    padding-left: 0.5rem;
}
</style>