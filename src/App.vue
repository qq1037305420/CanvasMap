<template>
    <div id="app">
        <HelloWorld ref="helloWorld" scale toolbar overview />
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import * as Builders from '@/map/utils/Builders';
import _ from 'lodash';
import empData from '@/empData.json';
@Component({
    components: {
        HelloWorld,
    },
})
export default class App extends Vue {
    mounted() {
        setTimeout(() => {
            this.drawEmpMarker(empData);
        }, 2000);
    }
    private drawEmpMarker(empData: any) {
        // 去掉没有数据的Emp
        let empHasPoint = _.filter(empData.data, e => {
            return e.lng !== null && e.lat !== null;
        });
        // 构造Emp方法
        let empOptions: Builders.EmpOptions[] = empHasPoint.map(eachPerson => {
            return {
                id: eachPerson.id,
                lng: eachPerson.lng,
                lat: eachPerson.lat,
                icon: eachPerson.icon,
            };
        });
        let hw = this.$refs.helloWorld as HelloWorld;
        hw.addEmpMarker(empOptions);
    }
}
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
