/* global AMap */
import {MapBase} from './MapBase';
import _ from 'lodash';
import * as PIXI from 'pixi.js';

export default class AmapCanvas extends MapBase {
    public PointType = 'GCJ';

    public init(container: HTMLDivElement) {
        const me = this;
        me.map = new AMap.Map(container, {
            resizeEnable: true,
            zoom: 15,
            center: new AMap.LngLat(120.236463, 35.958023),
            animateEnable: false,
        });
        this.PIXI = new PIXI.Application({
            transparent: true,
        });
        me.canvas = this.PIXI.view;
        me.canvas.style.position = 'absolute';
        me.canvas.style.top = '0';
        me.canvas.style.left = '0';

        me.map.on('complete', function() {
            me.canvas.width = me.map.getSize().width;
            me.canvas.height = me.map.getSize().height;
            container.appendChild(me.canvas);
            me.EventBus.emit('mapLoaded');
            me.maploaded();
            me.addToolBar();
            me.map.on('resize', e => {
                me.canvas.width = me.map.getSize().width;
                me.canvas.height = me.map.getSize().height;
                me.zoomRender();
            });
            me.map.on('zoomend', () => {
                me.zoomRender();
            });
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
            zoom: this.map.getZoom(),
        };
    }

    public panTo(lng: number, lat: number) {
        this.map.panTo(new AMap.LngLat(lng, lat));
    }

    public panBy(x: number, y: number) {
        this.map.panBy(x, y);
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

    public gps2pix(lng: number, lat: number) {
        return this.map.lnglatTocontainer([lng, lat]);
    }

    public pix2gps(x: number, y: number) {
        return this.map.containerToLngLat(new AMap.Pixel(x, y));
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
