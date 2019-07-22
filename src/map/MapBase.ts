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

    public maploaded() {
        let me = this;
        const debounceGetPoint = _.debounce(this.moveRender, 33);
        debounceGetPoint.call(me);
        // me.canvas.addEventListener('mousedown', function(e) {
        //     let previousEvent: any = null;
        //     function onMouseMove(event) {
        //         let movementX = event.movementX || 0;
        //         let movementY = event.movementY || 0;
        //         if (!movementX && previousEvent) {
        //             movementX = event.layerX - previousEvent.layerX;
        //             movementY = event.layerY - previousEvent.layerY;
        //         }
        //         me.panBy(movementX, movementY);
        //         me.PIXI.stage.children.forEach(e => {
        //             e.x += movementX;
        //             e.y += movementY;
        //         });
        //         debounceGetPoint.call(me);
        //         previousEvent = event;
        //     }
        //     me.canvas.addEventListener('mousemove', onMouseMove);
        //     me.canvas.onmouseup = () => {
        //         me.canvas.removeEventListener('mousemove', onMouseMove);
        //         me.canvas.onmouseup = null;
        //     };
        //     me.canvas.onmouseout = () => {
        //         me.canvas.removeEventListener('mousemove', onMouseMove);
        //         me.canvas.onmouseup = null;
        //     };
        // });

        // me.canvas.addEventListener('mousewheel', function(e) {
        //     if (e.deltaY < 0) {
        //         me.zoomIn(e.layerX, e.layerY);
        //     } else {
        //         me.zoomOut(e.layerX, e.layerY);
        //     }
        // });
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

    // public SuperCluster = new Supercluster({
    //     radius: 400,
    //     maxZoom: 18,
    // });
    public moveRender() {
        let me = this;
        let bound = me.getGpsBounds();
        let C2P = new Coord2Pix(
            bound.maxlng,
            bound.minlng,
            bound.maxlat,
            bound.minlat,
            bound.height,
            bound.width
        );
        let polygon = new Terraformer.Primitive(
            new Terraformer.Polygon([me.getGpsRange()])
        );
        // (me.PIXI.stage as PIXI.Container).removeChildren();

        me.store.withinstream(polygon, e => {
            me.DisplayStore.get(e.id)
                .then(res => {
                    if (res) {
                        //TODO
                    } else {
                        me.DisplayStore.add(e);
                        let point = e.geometry.coordinates;
                        let pix = C2P.corrd2pix(point[0], point[1]);
                        if (!pix || !pix.x || !pix.y) return;
                        const circle = new PIXI.Graphics();
                        circle.beginFill(0xde3249, 1);
                        circle.drawCircle(pix.x, pix.y, 5);
                        circle.endFill();
                        circle.interactive = true;
                        circle.cursor = 'pointer';
                        circle.addListener('click', () => {
                            console.log(e.properties.id);
                        });
                        me.PIXI.stage.addChild(circle);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    public zoomRender() {
        let me = this;
        (me.PIXI.stage as PIXI.Container).removeChildren();
        me.DisplayStore = new GeoStore.GEOSTORE();
        this.moveRender();
    }
}
