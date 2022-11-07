/* global BMap */
import {MapBase} from './MapBase';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import {Coord2Pix, BD2GCJ, GCJ2GPS} from '@/map/coordinate';
import * as Terraformer from 'terraformer';
import ZR from 'zrender';

export default class BmapCanvas extends MapBase {
    public PointType = 'BD';
    public init(container: HTMLElement) {
        const projection = new BMap.MercatorProjection();
        this.map = new BMap.Map(container, {enableHighResolution: true});
        this.map.centerAndZoom(new BMap.Point(120.236463, 35.958023), 15);
        this.map.enableScrollWheelZoom();
        var tilelayer = new BMap.TileLayer();
        tilelayer.getTilesUrl = (x, y, z) => {
            var halfTileNum = Math.pow(2, y - 18);
            /* 左上角 */
            let NWPoint = projection.pointToLngLat(
                new BMap.Pixel(
                    (x.x * 256) / halfTileNum,
                    (x.y * 256) / halfTileNum
                )
            );
            /* 右上 */
            let NEPoint = projection.pointToLngLat(
                new BMap.Pixel(
                    ((x.x + 1) * 256) / halfTileNum,
                    (x.y * 256) / halfTileNum
                )
            );
            /* 右下角 */
            let SEPoint = projection.pointToLngLat(
                new BMap.Pixel(
                    ((x.x + 1) * 256) / halfTileNum,
                    ((x.y + 1) * 256) / halfTileNum
                )
            );
            /* 左下 */
            let SWPoint = projection.pointToLngLat(
                new BMap.Pixel(
                    (x.x * 256) / halfTileNum,
                    ((x.y + 1) * 256) / halfTileNum
                )
            );

            let points = [NWPoint, NEPoint, SEPoint, SWPoint];

            points = points.map(e => {
                e = BD2GCJ(e);
                e = GCJ2GPS(e);
                return [e.lng, e.lat];
            });

            let bound = {
                minlng: points[3][0],
                minlat: points[3][1],
                maxlng: points[1][0],
                maxlat: points[1][1],
                width: 256,
                height: 256,
                zoom: z,
            };

            let C2P = new Coord2Pix(
                bound.maxlng,
                bound.minlng,
                bound.maxlat,
                bound.minlat,
                bound.height,
                bound.width
            );
            let polygon = new Terraformer.Primitive(
                new Terraformer.Polygon([
                    [
                        [points[0][0] - 0.0002, points[0][1] + 0.0002],
                        [points[1][0] + 0.0002, points[1][1] + 0.0002],
                        [points[2][0] + 0.0002, points[2][1] - 0.0002],
                        [points[3][0] - 0.0002, points[3][1] - 0.0002],
                    ],
                ])
            );
            let me = this;
            const canvas = document.createElement('canvas');
            const zr = ZR.init(canvas, {width: 256, height: 256});
            me.store.withinstream(polygon, e => {
                let point = e.geometry.coordinates;
                let pix = C2P.corrd2pix(point[0], point[1]);
                var circle = new ZR.Circle({
                    shape: {
                        cx: pix.x,
                        cy: pix.y,
                        r: 5,
                    },
                    style: {
                        fill: '#eeeeee',
                        stroke: '#F00',
                    },
                });
                circle.on('click', ex => {
                    console.log(e);
                });
                zr.add(circle);
            });
            return canvas;
        };
        this.map.addTileLayer(tilelayer);
        this.maploaded();
        this.addToolBar();
    }

    public panTo(lng: number, lat: number) {
        this.map.panTo(new BMap.Point(lng, lat), {noAnimation: true});
    }
    public panBy(x: number, y: number) {
        this.map.panBy(x, y, {noAnimation: true});
    }
    public zoomIn(x: number, y: number) {
        if (this.map.getZoom() < 18) {
            let center = this.pix2gps(x, y);
            this.panTo(center.lng, center.lat);
            this.map.zoomIn();
        }
    }
    public zoomOut(x: number, y: number) {
        if (this.map.getZoom() > 6) {
            let center = this.pix2gps(x, y);
            this.panTo(center.lng, center.lat);
            this.map.zoomOut();
        }
    }
    public getBounds() {
        let bounds = this.map.getBounds();
        let size = this.map.getSize();
        return {
            minlng: bounds.getSouthWest().lng,
            minlat: bounds.getSouthWest().lat,
            maxlng: bounds.getNorthEast().lng,
            maxlat: bounds.getNorthEast().lat,
            width: size.width,
            height: size.height,
            zoom: this.map.getZoom(),
        };
    }
    public gps2pix(lng: number, lat: number) {
        return this.map.pointToPixel(new BMap.Point(lng, lat));
    }
    public pix2gps(x: number, y: number) {
        return this.map.pixelToPoint(new BMap.Pixel(x, y));
    }
    /**
     * 地图控件类
     */
    public addScale() {
        let mapObj = this.map;
        mapObj.addControl(new BMap.ScaleControl());
    }
    public addToolBar() {
        let mapObj = this.map;
        mapObj.addControl(new BMap.NavigationControl());
    }
    public addOverView() {
        let mapObj = this.map;
        mapObj.addControl(new BMap.OverviewMapControl());
    }
    public addMapType() {
        let mapObj = this.map;
        mapObj.addControl(new BMap.MapTypeControl());
    }
    public addGeolocation() {
        let mapObj = this.map;
        mapObj.addControl(new BMap.GeolocationControl());
    }
}
