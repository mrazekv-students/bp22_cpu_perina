import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// Globals
// Animations
app.config.globalProperties.instructionWaitTime = { value: 500 };
app.config.globalProperties.connectorFillTime = { value: 500 };
app.config.globalProperties.connectorFadeTime = { value: 1000 };
app.config.globalProperties.highlightFadeTime = { value: 1000 };
// Cycle counter
app.config.globalProperties.cycleCounter = { value: 0 };
app.config.globalProperties.cycleCosts = { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 };
// Memory size
app.config.globalProperties.memorySize = { cache: 4, ram: 16 };

app.mount('#app');
