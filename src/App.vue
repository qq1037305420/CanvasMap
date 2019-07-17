<template>
    <div id="app">
        <!-- <HelloWorld ref="helloWorld" scale toolbar overview /> -->
        <geostore />
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import geostore from './components/geostore.vue';
// import _ from 'lodash';
// import empData from '@/empData.json';
@Component({
    components: {
        HelloWorld,
        geostore,
    },
})
export default class App extends Vue {}
</script>

<style lang="scss">
html,
body,
#app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
