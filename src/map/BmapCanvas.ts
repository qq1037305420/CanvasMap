/* global BMap */
import {MapBase} from './MapBase';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

export default class BmapCanvas extends MapBase {
    public PointType = 'BD';
    public init(container: HTMLElement) {
        this.map = new BMap.Map(container, {enableHighResolution: true});
        this.map.centerAndZoom(new BMap.Point(120.236463, 35.958023), 15);
        this.map.enableScrollWheelZoom();
        var tilelayer = new BMap.TileLayer();
        tilelayer.getTilesUrl = (x, y, z) => {
            console.log(x, y, z);
            console.log(this.toLnglat(x.x, x.y, y));
            return 'logo.png';
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
