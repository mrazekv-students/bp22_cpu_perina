<template>
    <div class="vertical-container main-container">
        <the-title title="Cache Simulator" author="Daniel Peřina" date="2022"
            organisation="Brno University of Technology" suborganisation="Faculty of Information Technology" 
            @UpdateSettings="Initialize"
        />

        <the-processor ref="processor"/>
    </div>
    <notifications :position="'bottom right'" :duration="10000" classes="vue-notification custom-notification"/>
</template>

<script>
import TheTitle from './components/TheTitle.vue';
import TheProcessor from './components/TheProcessor.vue';
export default {
    name: 'App',
    components: { TheTitle, TheProcessor },

    methods: {
        Initialize() {
            this.$refs.processor.Initialize();
        }
    }
}
</script>

<style>
/* COMMON */
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
    max-width: 300px;
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

/* SPECIFIC */
.main-container {
    height: 100%;
}
</style>
