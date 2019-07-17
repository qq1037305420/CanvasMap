import _ from 'lodash';
import Env from './utils/Env';
import zrender from 'zrender';
import * as Terraformer from 'terraformer';
import {GEOSTORE} from '@/map/utils/Store';
import Supercluster from 'supercluster';
var geojsonCoords = require('@mapbox/geojson-coords');
import {GeoTypes} from '@/map/utils/GeoTypes';
import {BD2GCJ, GCJ2GPS, GPS2GCJ} from './coordinate';

export abstract class MapBase {
    public map: any;
    public zr: any;
    public PointType: string = '';

    // public totalPoints: any[] = [];
    public SuperCluster = new Supercluster({
        radius: 400,
        maxZoom: 16,
    });
    public abstract init(container: HTMLElement | null): void;
    public abstract gps2pix(lng: number, lat: number): any;
    public abstract getBounds(): any;
    /**
     * Map Control Group
     */
    public abstract addScale(): void;
    public abstract addMapType(): void;
    public abstract addToolBar(): void; // NavigationControl ToolBar
    public abstract addOverView(): void; // OverView MapControl
    public abstract addGeolocation(): void; // geolocation

    public gps2gcj(val: any[]) {
        return GPS2GCJ({lng: val[0], lat: val[1]});
    }
    public getGpsBounds() {
        let b = this.getBounds();
        let points: any[] = [
            {lng: b.minlng, lat: b.minlat},
            {lng: b.minlng, lat: b.maxlat},
            {lng: b.maxlng, lat: b.minlat},
            {lng: b.maxlng, lat: b.maxlat},
        ];
        if (this.PointType == 'GCJ') {
            points = points.map(e => {
                e = GCJ2GPS(e);
                return [e.lng, e.lat];
            });
        } else if (this.PointType == 'BD') {
            points = points.map(e => {
                e = GCJ2GPS(BD2GCJ(e));
                return [e.lng, e.lat];
            });
        }
        return points;
    }

    // public draw() {
    //     this.drawMarker();
    //     this.zr.flush();
    // }

    // private drawMarker() {
    //     this.SuperCluster.load(Object.values(GEOSTORE.store.data));
    //     let bounds = this.getBounds();
    //     let clusterData = this.SuperCluster.getClusters(
    //         [bounds.minlng, bounds.minlat, bounds.maxlng, bounds.maxlat],
    //         bounds.zoom
    //     );
    //     clusterData.forEach(element => {
    //         let elementPoints = geojsonCoords(element);
    //         if (
    //             element.type === GeoTypes.Feature &&
    //             element.geometry.type === GeoTypes.Point
    //         ) {
    //             let pix = this.gps2pix(
    //                 elementPoints[0][0],
    //                 elementPoints[0][1]
    //             );
    //             if (_.isEmpty(pix)) return;
    //             if (element.properties.cluster === true) {
    //                 let clusterCount = element.properties.point_count;
    //                 this.zr.add(
    //                     new zrender.Heart({
    //                         shape: {
    //                             cx: pix.x,
    //                             cy: pix.y,
    //                             width: 50,
    //                             height: 50,
    //                         },
    //                         style: {
    //                             fill: 'rgba(255,0,0,0.5)',
    //                             stroke: 'none',
    //                             text: clusterCount,
    //                         },
    //                     })
    //                 );
    //             } else {
    //                 this.zr.add(
    //                     new zrender.Image({
    //                         style: {
    //                             image: Env.IMG_URL + element.properties.icon,
    //                             x: pix.x,
    //                             y: pix.y,
    //                         },
    //                     })
    //                 );
    //             }
    //         }
    //     });
    // }
}
