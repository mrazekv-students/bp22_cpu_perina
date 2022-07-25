<template>
    <the-processor/>
    <notifications :position="'bottom right'" :duration="10000" classes="vue-notification custom-notification"/>
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    background: var(--backgroundColor);
    color: var(--fontColor);
}

.custom-notification {
    font-size: 1rem;
    padding: 15px;
    border-radius: 5px;
}
.custom-notification .notification-title {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
}

.v-popper--theme-tooltip .v-popper__inner {
    padding: 3px 6px;
    color: var(--backgroundColor);

    border: solid 1px var(--fontColorFaded);
    border-radius: 5px;
    background: var(--fontColor);
}
.v-popper--theme-tooltip.v-popper__popper--hidden {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
}
.v-popper--theme-tooltip.v-popper__popper--shown {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
}
.v-popper--theme-tooltip.v-popper__popper--skip-transition {
    transition: none !important;
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
