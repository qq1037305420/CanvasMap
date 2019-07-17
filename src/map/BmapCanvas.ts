/* global BMap */
import {MapBase} from './MapBase';
import EE from './EventBus';
import zrender from 'zrender';
import _ from 'lodash';
export default class BmapCanvas extends MapBase {
    private extra: any;
    private canvas: any;
    public PointType = 'BD';

    public init(container: HTMLElement) {
        this.map = new BMap.Map(container);
        this.map.centerAndZoom(
            new BMap.Point(120.17047335303083, 35.97316165527997),
            12
        );
        this.map.setCurrentCity('北京');
        this.map.enableScrollWheelZoom(true);
        let bmapCanvas = new BMap.CanvasLayer({update: this.update});
        this.map.addOverlay(bmapCanvas);
        this.canvas = bmapCanvas.canvas;
        this.zr = zrender.init(this.canvas);
        this.canvas.height = this.map.getSize().height;
        this.canvas.width = this.map.getSize().width;
        bmapCanvas.extra = this;
        EE.emit('mapLoaded');
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
        let bmappoint = new BMap.Point(lng, lat);
        return this.map.getBounds().containsPoint(bmappoint)
            ? this.map.pointToPixel(bmappoint)
            : null;
    }

    private update() {
        let that = this.extra ? this.extra : this;
        that.zr.clear();
        that.draw();
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
