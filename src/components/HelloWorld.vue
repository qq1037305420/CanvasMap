<template>
    <div id="hello"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import MapFactory from '@/map/MapFactory';
import _ from 'lodash';
import data from './data.json';
import EE from '@/map/EventBus';
import {MapBase} from '@/map/MapBase';
import {PathType} from '@/map/PathBuilder';

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
    @Prop({type: String, default: 'amap'})
    public mapType: string;
    created() {
        EE.once('mapLoaded', () => {
            this.loadControls();
            let empHasPoint = _.filter(data.data, e => {
                return e.lng !== null && e.lat !== null;
            });
            empHasPoint.forEach(eachPerson => {
                this.map.addMarker({
                    lng: eachPerson.lng,
                    lat: eachPerson.lat,
                    iconUrl: `http://file2.5ihw.cn:9033/comm/image/sys/${
                        eachPerson.icon
                    }`,
                    content: eachPerson.name,
                });
            });
            let empPoints = empHasPoint.map(e => {
                return {lng: e.lng, lat: e.lat};
            });
            // this.map.addPath({ points: empPoints, pathType: PathType.CIRCLE })
            // this.map.addPath({ points: empPoints, pathType: PathType.LINE })
            // this.map.addPath({ points: empPoints, pathType: PathType.RECTANGLE })
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
