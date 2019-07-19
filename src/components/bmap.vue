<template>
    <div ref="mapcontainer" style="height: 50%; width: 100%;"></div>
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
        this.map = fac.createMapObj('bmap');
        this.map.init(this.$refs.mapcontainer);
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
        let bound = me.map.getGpsBounds();
        let C2P = new Coord2Pix(
            bound.maxlng,
            bound.minlng,
            bound.maxlat,
            bound.minlat,
            bound.height,
            bound.width
        );
        let polygon = new Terraformer.Primitive(
            new Terraformer.Polygon([me.map.getGpsRange()])
        );
        me.map.zr.clear();
        me.store
            .within(polygon)
            .then(res => {
                res.forEach(function(e: any) {
                    let point = e.geometry.coordinates;
                    let pix = C2P.corrd2pix(point[0], point[1]);
                    if (!pix || !pix.x || !pix.y) return;
                    let circle = new zrender.Circle({
                        shape: {
                            cx: pix.x,
                            cy: pix.y,
                            r: 5,
                        },
                        style: {
                            fill: 'rgba(255,0,0,0.5)',
                            stroke: 'none',
                        },
                    });
                    circle.extra = e;
                    circle.on('click', x => {
                        console.log('circle on click', x.target.extra.id);
                    });
                    me.map.zr.add(circle);
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
