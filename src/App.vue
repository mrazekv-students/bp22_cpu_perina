<template>
    <the-processor/>
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
    min-width: 1300px;
    height: 100vh;
}
* {
    margin: 0;
    box-sizing: border-box;
}
body {
    display: flex;
    overflow-y: hidden;
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
