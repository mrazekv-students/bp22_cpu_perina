import { createApp } from 'vue';
import Notifications from '@kyvg/vue3-notification';
import FloatingVue from 'floating-vue'
import App from './App.vue';

const app = createApp(App);

// Globals
// Animations
app.config.globalProperties.animations = { enable: true };
app.config.globalProperties.times = { instructionWait: 500, connectorFill: 500, connectorFade: 1000, highlightFade: 1000 };
// Cycle counter
app.config.globalProperties.cacheStats = { cycles: 0, memoryAccesses: 0, cacheHits: 0, cacheMisses: 0 };
app.config.globalProperties.cycleCosts = { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 };
// Memory size
app.config.globalProperties.memorySize = { cache: 4, ram: 16 };

// Colors
app.config.globalProperties.colors = { secondaryColor: "#8b161c", secondaryColorLight: "#cc1717", fontColor: "#D6D6D6", infoColor: "#3f60bb" }

// FloatingVue tooltip config
FloatingVue.options.disposeTimeout = 0;
FloatingVue.options.instantMove = true;
FloatingVue.options.themes.tooltip.triggers = ["hover"];
FloatingVue.options.themes.tooltip.delay = { show: 500, hide: 0 };

app.use(Notifications).use(FloatingVue).mount('#app');
