<template>
    <div ref="mapcontainer" style="height: 100%; width: 100%;"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import * as GeoStore from '@/map/utils/Store';
import Terraformer from 'terraformer';
// import Data from './facility.json';
import Data from './40k.json';
//Map
import MapFactory from '@/map/MapFactory';

@Component
export default class HelloWorld extends Vue {
    public map: any;

    public mounted() {
        this.initMap();
        this.fetchData();
    }

    public initMap() {
        let me = this;
        let fac = new MapFactory();
        this.map = fac.createMapObj('amap');
        this.map.init(this.$refs.mapcontainer);
    }

    public fetchData() {
        Data.forEach(e => {
            this.map.store.add(
                GeoStore.FeatureBuilder(
                    e._id,
                    new Terraformer.Point([
                        e.local.lng / 1000000,
                        e.local.lat / 1000000,
                    ]),
                    e
                )
            );
        });
    }
}
</script>
