<template>
    <div id="hello"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import MapFactory from '@/map/MapFactory';
import _ from 'lodash';
import {MapBase} from '@/map/MapBase';
import facilityData from './facility.json';
// import Worker from 'worker-loader!@/map/Worker.js';

@Component
export default class HelloWorld extends Vue {
    public map!: MapBase;
    @Prop({type: Boolean, default: false})
    public scale!: boolean;
    @Prop({type: Boolean, default: false})
    public toolbar!: boolean;
    @Prop({type: Boolean, default: false})
    public overview!: boolean;
    @Prop({type: Boolean, default: false})
    public maptype!: boolean;
    @Prop({type: Boolean, default: false})
    public geolocation!: boolean;
    @Prop({type: String, default: 'amap'})
    public mapType!: string;
    // public worker = new Worker();
    mounted() {
        let fac = new MapFactory();
        this.map = fac.createMapObj(this.mapType);
        this.map.init(document.getElementById('hello'));
        console.log(JSON.stringify(this.map.getGpsBounds()));
    }

    public loadControls() {
        if (this.scale) {
            this.map.addScale();
        }
        if (this.toolbar) {
            this.map.addToolBar();
        }
        if (this.overview) {
            this.map.addOverView();
        }
        if (this.maptype) {
            this.map.addMapType();
        }
        if (this.geolocation) {
            this.map.addGeolocation();
        }
    }
}
</script>
<style>
#hello {
    height: 100%;
    width: 100%;
}
</style>
