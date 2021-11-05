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
  width: 100%;
  min-height: 100%;
  background: #3A3A40;
}
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #D6D6D6;
}
</style>
