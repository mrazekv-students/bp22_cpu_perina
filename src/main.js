import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// Globals
app.config.globalProperties.connectorFillTime = 300;
app.config.globalProperties.connectorFadeTime = 500;

app.mount('#app');
