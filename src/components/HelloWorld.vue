<template>
    <div id="hello"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import MapFactory from '@/map/MapFactory';
import _ from 'lodash';
import empData from './empData.json';
import facilityData from './facility.json';
import EE from '@/map/EventBus';
import {MapBase} from '@/map/MapBase';
import {PathType} from '@/map/PathBuilder';
import Env from '@/map/utils/Env';
import * as Builders from '@/map/utils/Builders';

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
            this.addEmpMarker(empData);
            facilityData.data.forEach(eachFacility => {
                this.map.addMarker({
                    lng: eachFacility.lng,
                    lat: eachFacility.lat,
                    icon: Env.IMG_URL + eachFacility.icon,
                });
            });
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
    public addEmpMarker(empData: any) {
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
