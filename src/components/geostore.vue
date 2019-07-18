<template>
    <div
        id="map-container"
        style="height: 100%; width: 100%; position:relative;"
    >
        <div id="hello" style="height: 100%; width: 100%;"></div>
        <!-- pointer-events: none; -->

        <canvas
            id="mapcanvas"
            style="  position: absolute; top: 0; left: 0px;"
        />
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import * as GeoStore from '@/map/utils/Store';
import Terraformer from 'terraformer';
import Data from './facility.json';
import _ from 'lodash';
import rewind from 'geojson-rewind';

//Map
import MapFactory from '@/map/MapFactory';
import zrender from 'zrender';
import {Coord2Pix} from '@/map/coordinate';

@Component
export default class HelloWorld extends Vue {
    public store: any;
    public map: any;
    public mounted() {
        this.initMap();
        this.initStore();
        this.fetchData();
    }

    public initMap() {
        let me = this;
        let fac = new MapFactory();
        this.map = fac.createMapObj('amap');
        this.map.init(document.getElementById('hello'));
        // let getData = _.debounce(me.getPoints, 33);
        // this.map.map.on('mapmove', function(e) {
        //     getData();
        // });
        setInterval(() => {
            me.getPoints();
        }, 33);
    }

    public initStore() {
        this.store = new GeoStore.GEOSTORE();
    }

    public fetchData() {
        Data.data.forEach(e => {
            this.store.add(
                GeoStore.FeatureBuilder(
                    e.id,
                    new Terraformer.Point([e.lng / 1000000, e.lat / 1000000]),
                    e
                )
            );
        });
    }

    public getPoints() {
        let me = this;
        let bounds = me.map.getGpsBounds();
        let bound = me.map.getBounds();
        // let C2P = new Coord2Pix(
        //     bound.maxlng,
        //     bound.minlng,
        //     bound.maxlat,
        //     bound.minlat,
        //     bound.height,
        //     bound.width
        // );
        let polygon = new Terraformer.Primitive(
            rewind(new Terraformer.Polygon([bounds]), true)
        );
        me.map.zr.clear();
        me.store
            .within(polygon)
            .then(res => {
                res.forEach(function(e: any) {
                    let point = e.geometry.coordinates;
                    point = me.map.gps2gcj(point);
                    // let pix = C2P.corrd2pix(point['lng'], point['lat']);
                    let pix = me.map.gps2pix(point['lng'], point['lat']);
                    me.map.zr.add(
                        new zrender.Circle({
                            shape: {
                                cx: pix.x,
                                cy: pix.y,
                                r: 5,
                            },
                            style: {
                                fill: 'rgba(255,0,0,0.5)',
                                stroke: 'none',
                            },
                        })
                    );
                });
            })
            .catch(err => {
                console.warn(err);
            })
            .finally(() => {
                me.map.zr.flush();
            });
    }
}
</script>
<style>
.amap-e {
    position: fixed;
    top: 0 !important;
    left: 0 !important;
}
</style>
