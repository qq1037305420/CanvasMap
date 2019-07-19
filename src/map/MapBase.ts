import _ from 'lodash';
import Env from './utils/Env';
import zrender from 'zrender';
import * as Terraformer from 'terraformer';
import {GEOSTORE} from '@/map/utils/Store';
import Supercluster from 'supercluster';
import EventEmitter from 'eventemitter3';
var geojsonCoords = require('@mapbox/geojson-coords');
import {BD2GCJ, GCJ2GPS, GPS2GCJ, GCJ2BD} from './coordinate';

export abstract class MapBase {
    public map: any;
    public zr: any;
    public canvas: any;
    public PointType: string = '';
    public EventBus = new EventEmitter();

    public maploaded() {
        let me = this;
        me.canvas.addEventListener('mousedown', function(e) {
            function onMouseMove(event) {
                me.panBy(event.movementX, event.movementY);
            }
            me.canvas.addEventListener('mousemove', onMouseMove);
            me.canvas.onmouseup = () => {
                me.canvas.removeEventListener('mousemove', onMouseMove);
                me.canvas.onmouseup = null;
            };
            me.canvas.onmouseout = () => {
                me.canvas.removeEventListener('mousemove', onMouseMove);
                me.canvas.onmouseup = null;
            };
        });

        me.canvas.addEventListener('mousewheel', function(e) {
            if (e.deltaY < 0) {
                me.zoomIn(e.pageX, e.pageY);
            } else {
                me.zoomOut(e.pageX, e.pageY);
            }
        });
    }

    public abstract init(container: HTMLElement | null): void;
    /* Native Map implementation */
    public abstract gps2pix(lng: number, lat: number): any;
    public abstract pix2gps(x: number, y: number): any;
    public abstract panBy(x: number, y: number): any;
    public abstract panTo(lng: number, lat: number): any;
    public abstract zoomIn(lng: number, lat: number): any;
    public abstract zoomOut(lng: number, lat: number): any;
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

    public gcj2bd(lng, lat) {
        return GCJ2BD({lng, lat});
    }

    // public SuperCluster = new Supercluster({
    //     radius: 400,
    //     maxZoom: 18,
    // });

    public getGpsRange() {
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

    public getGpsBounds() {
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
}
