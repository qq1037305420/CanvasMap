import _ from 'lodash';
import Env from './utils/Env';
import * as Terraformer from 'terraformer';
import Supercluster from 'supercluster';
import EventEmitter from 'eventemitter3';
var geojsonCoords = require('@mapbox/geojson-coords');
import {BD2GCJ, GCJ2GPS} from './coordinate';
import * as GeoStore from '@/map/utils/Store';
import {Coord2Pix} from '@/map/coordinate';
import * as PIXI from 'pixi.js';

export abstract class MapBase {
    public map: any;
    public PIXI: PIXI.Application;
    public PointType: string = '';
    public EventBus = new EventEmitter();
    public store = new GeoStore.GEOSTORE();
    public DisplayStore = new GeoStore.GEOSTORE();
    public canvas: any;

    public abstract init(container: HTMLElement | null): void;
    /* Native Map implementation */
    public abstract gps2pix(lng: number, lat: number): {x: number; y: number};
    public abstract pix2gps(x: number, y: number): {lng: number; lat: number};
    public abstract panBy(x: number, y: number): void;
    public abstract panTo(lng: number, lat: number): void;
    public abstract zoomIn(lng: number, lat: number): void;
    public abstract zoomOut(lng: number, lat: number): void;
    public abstract getBounds(): {
        minlng: number;
        minlat: number;
        maxlng: number;
        maxlat: number;
        width: number;
        height: number;
        zoom: number;
    };

    // Map Control Group
    public abstract addScale(): void;
    public abstract addMapType(): void;
    // NavigationControl ToolBar
    public abstract addToolBar(): void;
    // OverView MapControl
    public abstract addOverView(): void;
    // geolocation
    public abstract addGeolocation(): void;

    public maploaded() {}

    private getGpsRange() {
        let b = this.getBounds();
        let points: any[] = [
            {lng: b.minlng, lat: b.minlat},
            {lng: b.maxlng, lat: b.minlat},
            {lng: b.maxlng, lat: b.maxlat},
            {lng: b.minlng, lat: b.maxlat},
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

    private getGpsBounds() {
        let b = this.getBounds();
        let points: any[] = [
            {lng: b.minlng, lat: b.minlat},
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
        return {
            maxlng: points[1][0],
            minlng: points[0][0],
            maxlat: points[1][1],
            minlat: points[0][1],
            height: b.height,
            width: b.width,
        };
    }

    public toLnglat(x, y, z) {
        let n = Math.pow(2, z);
        let lng = (x / n) * 360.0 - 180.0;
        let lat = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
        lat = (lat * 180.0) / Math.PI;
        return [lng, lat];
    }
}
