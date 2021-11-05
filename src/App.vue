<template>
  <the-layout/>
</template>

<script>
import TheLayout from './components/TheLayout.vue'
export default {
  name: 'App',
  components: { TheLayout }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
