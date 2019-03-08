/* global AMap */
import {MapBase} from './MapBase';
import _ from 'lodash';
import EE from './EventBus';
import zrender from 'zrender';

export default class AmapCanvas extends MapBase {
    private extra: any;
    private canvas: any;
    public init(container: HTMLDivElement) {
        const me = this;
        me.map = new AMap.Map(container, {
            zoom: 12,
        });
        me.canvas = document.createElement('canvas');
        me.map.on('complete', function() {
            me.canvas.width = me.map.getSize().width;
            me.canvas.height = me.map.getSize().height;
            // 将 canvas 宽高设置为地图实例的宽高
            var canvasLayer = new AMap.CustomLayer(me.canvas, {zIndex: 200});
            canvasLayer.extra = me;
            canvasLayer.setMap(me.map);
            canvasLayer.render = me.update;
            me.zr = zrender.init(me.canvas);
            EE.emit('mapLoaded');
        });
    }

    public getBounds() {
        let bounds = this.map.getBounds();
        let size = this.map.getSize();
        return {
            minlng: bounds.southwest['lng'],
            minlat: bounds.southwest['lat'],
            maxlng: bounds.northeast['lng'],
            maxlat: bounds.northeast['lat'],
            width: size.width,
            height: size.height,
        };
    }
    private update() {
        let that = this.extra ? this.extra : this;
        that.zr.clear();
        that.draw();
    }

    public gps2pix(lng: number, lat: number) {
        return this.map.getBounds().contains([lng, lat])
            ? this.map.lnglatTocontainer([lng, lat])
            : null;
    }

    /**
     * 地图控件类
     */
    public addScale() {
        let mapObj = this.map;
        mapObj.plugin(['AMap.Scale'], function() {
            mapObj.addControl(new AMap.Scale());
        });
    }

    public addToolBar() {
        let mapObj = this.map;
        mapObj.plugin(['AMap.ToolBar'], function() {
            mapObj.addControl(new AMap.ToolBar());
        });
    }

    public addOverView() {
        let mapObj = this.map;
        mapObj.plugin(['AMap.OverView'], function() {
            mapObj.addControl(new AMap.OverView());
        });
    }

    public addMapType() {
        let mapObj = this.map;
        mapObj.plugin(['AMap.MapType'], function() {
            mapObj.addControl(new AMap.MapType());
        });
    }

    public addGeolocation() {
        let mapObj = this.map;
        mapObj.plugin(['AMap.Geolocation'], function() {
            mapObj.addControl(new AMap.Geolocation());
        });
    }
}
