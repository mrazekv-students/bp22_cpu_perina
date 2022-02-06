<template>
    <the-layout style="width: 100%; height: 100%;"/>
</template>

<script>
import TheLayout from './components/TheLayout.vue'
export default {
    name: 'App',
    components: { TheLayout }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100vh;
}
* {
    margin: 0;
    box-sizing: border-box;
}
body {
    margin: 0;
    overflow: hidden;
    display: flex;

    border-style: dotted;
    border-width: 2px;

    background: #3A3A40;
    color: #D6D6D6;
}

.horizontal-container {
    display: flex;
}
.vertical-container {
    display: initial;
}
</style>
