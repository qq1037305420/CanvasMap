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
@Component
export default class HelloWorld extends Vue {
    public map: MapBase;
    @Prop({type: Boolean, default: false})
    public scale: boolean;
    @Prop({type: Boolean, default: false})
    public toolbar: boolean;
    @Prop({type: Boolean, default: false})
    public overview: boolean;
    @Prop({type: Boolean, default: false})
    public maptype: boolean;
    @Prop({type: Boolean, default: false})
    public geolocation: boolean;
    @Prop({type: String, default: 'bmap'})
    public mapType: string;
    created() {
        EE.once('mapLoaded', () => {
            this.loadControls();
            let empHasPoint = _.filter(empData.data, e => {
                return e.lng !== null && e.lat !== null;
            });
            empHasPoint.forEach(eachPerson => {
                this.map.addMarker({
                    lng: eachPerson.lng,
                    lat: eachPerson.lat,
                    iconUrl: Env.IMG_URL + eachPerson.icon,
                    content: eachPerson.name,
                });
            });
            facilityData.data.forEach(eachFacility => {
                this.map.addMarker({
                    lng: eachFacility.lng,
                    lat: eachFacility.lat,
                    iconUrl: Env.IMG_URL + eachFacility.icon,
                });
            });
            facilityData.data.forEach(eachFacility => {
                this.map.addMarker({
                    lng: eachFacility.lng,
                    lat: eachFacility.lat,
                    iconUrl: Env.IMG_URL + eachFacility.icon,
                });
            });
            facilityData.data.forEach(eachFacility => {
                this.map.addMarker({
                    lng: eachFacility.lng,
                    lat: eachFacility.lat,
                    iconUrl: Env.IMG_URL + eachFacility.icon,
                });
            });
            facilityData.data.forEach(eachFacility => {
                this.map.addMarker({
                    lng: eachFacility.lng,
                    lat: eachFacility.lat,
                    iconUrl: Env.IMG_URL + eachFacility.icon,
                });
            });
            facilityData.data.forEach(eachFacility => {
                this.map.addMarker({
                    lng: eachFacility.lng,
                    lat: eachFacility.lat,
                    iconUrl: Env.IMG_URL + eachFacility.icon,
                });
            });
            let empPoints = empHasPoint.map(e => {
                return {lng: e.lng, lat: e.lat};
            });
            setTimeout(() => {
                this.map.addText({
                    lng: empPoints[0].lng,
                    lat: empPoints[0].lat,
                    content: 'Hello',
                });
                this.map.redraw();
            }, 2000);
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
}
</script>
<style>
#hello {
    height: 100%;
    width: 100%;
}
</style>
