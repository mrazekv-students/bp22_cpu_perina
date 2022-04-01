import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// Globals
// Animations
app.config.globalProperties.instructionWaitTime = 500;
app.config.globalProperties.connectorFillTime = 500;
app.config.globalProperties.connectorFadeTime = 1000;
app.config.globalProperties.highlightFadeTime = 1000;
// Cycle counter
app.config.globalProperties.cycleCounter = { value: 0 };
app.config.globalProperties.cycleCosts = { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 };

app.mount('#app');
