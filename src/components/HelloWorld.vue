<template>
    <div id="hello"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import MapFactory from '@/map/MapFactory';
import _ from 'lodash';
import EE from '@/map/EventBus';
import {MapBase} from '@/map/MapBase';
import * as Builders from '@/map/utils/Builders';
import facilityData from './facility.json';

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
    created() {
        EE.once('mapLoaded', () => {
            this.loadControls();
            // setTimeout(() => {
            //     facilityData.data.forEach(eachFacility => {
            //         this.map.addMarker({
            //             lng: eachFacility.lng,
            //             lat: eachFacility.lat,
            //             icon: eachFacility.icon,
            //         });
            //     });
            // }, 200);
            // setTimeout(() => {
            //     this.map.draw();
            // }, 500);
        });
    }
    mounted() {
        let fac = new MapFactory();
        this.map = fac.createMapObj(this.mapType);
        this.map.init(document.getElementById('hello'));
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

    public addEmpMarker(empOptions: Builders.EmpOptions[]) {
        console.log(111111111);
        empOptions.map(empOption => {
            return this.map.addMarker(
                _.merge({}, Builders.DEFAULT_EMP_OPTIONS, empOption)
            );
        });
    }
}
</script>
<style>
#hello {
    height: 100%;
    width: 100%;
}
</style>
