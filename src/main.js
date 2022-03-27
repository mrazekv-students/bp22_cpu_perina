import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// Globals
app.config.globalProperties.instructionWaitTime = 500;
app.config.globalProperties.connectorFillTime = 500;
app.config.globalProperties.connectorFadeTime = 1000;
app.config.globalProperties.highlightFadeTime = 1000;

app.mount('#app');
