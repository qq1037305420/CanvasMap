/* global BMap */
import {MapBase} from './MapBase';
import paper from 'paper';
import {GPS2GCJ, GCJ2BD} from './coordinate';
import EE from './EventBus';
export default class BmapCanvas extends MapBase {
    private extra: any;
    private paper: any;
    private canvas: any;
    public init(container: HTMLElement) {
        this.map = new BMap.Map(container);
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
        EE.emit('mapLoaded');
        this.map.setCurrentCity('北京');
        this.map.enableScrollWheelZoom(true);
        this.canvas = new BMap.CanvasLayer({update: this.update});
        this.canvas.extra = this;
        this.map.addOverlay(this.canvas);
    }

    public gps2pix(lng: number, lat: number) {
        let gps = GPS2GCJ({lng: lng / 1000000, lat: lat / 1000000});
        gps = GCJ2BD({lng: gps.lng, lat: gps.lat});
        gps = new BMap.Point(gps.lng, gps.lat);
        let pix = this.map.pointToPixel(gps);
        return {x: pix.x, y: pix.y};
    }

    public update() {
        if (!this.extra.paper) {
            this.extra.paper = paper.setup(this.canvas);
        } else {
            paper.project.activeLayer.removeChildren();
        }
        this.extra.draw();
        paper.view.draw();
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
