import { createApp } from 'vue';
import Notifications from '@kyvg/vue3-notification';
import App from './App.vue';

const app = createApp(App);

// Globals
// Animations
app.config.globalProperties.times = { instructionWait: 500, connectorFill: 500, connectorFade: 1000, highlightFade: 1000 };
// Cycle counter
app.config.globalProperties.cycleCounter = { value: 0 };
app.config.globalProperties.cycleCosts = { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 };
// Memory size
app.config.globalProperties.memorySize = { cache: 4, ram: 16 };

// Colors
app.config.globalProperties.colors = { secondaryColor: "#8b161c", secondaryColorLight: "#cc1717", fontColor: "#D6D6D6", infoColor: "#3f60bb" }

app.use(Notifications).mount('#app');
