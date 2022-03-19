<template>
    <the-processor style="width: 100%; height: 100%;"/>
</template>

<script>
import TheProcessor from './components/TheProcessor.vue'
export default {
    name: 'App',
    components: { TheProcessor }
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
    background: var(--backgroundColor);
    color: var(--fontColor);
}

.horizontal-container {
    display: flex;
    flex-direction: row;
}
.vertical-container {
    display: flex;
    flex-direction: column;
}
</style>
