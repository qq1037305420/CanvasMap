/* global AMap */
import {MapBase} from './MapBase';
import _ from 'lodash';
import EE from './EventBus';
import zrender from 'zrender';
const DndSimulator = require('./dndsim.js');

export default class AmapCanvas extends MapBase {
    private extra: any;
    private canvas: any;
    public PointType = 'GCJ';

    public init(container: HTMLDivElement) {
        const me = this;
        me.map = new AMap.Map(container, {
            zoom: 15,
            center: new AMap.LngLat(120.236463, 35.958023),
            animateEnable: false,
        });
        me.canvas = document.getElementById('mapcanvas') as Element;
        let mapContainer = document.getElementById('map-container');
        me.map.on('complete', function() {
            me.canvas.width = me.map.getSize().width;
            me.canvas.height = me.map.getSize().height;
            mapContainer.appendChild(me.canvas);
            // 将 canvas 宽高设置为地图实例的宽高
            // var canvasLayer = new AMap.CustomLayer(me.canvas, {zIndex: 200});
            // canvasLayer.extra = me;
            // canvasLayer.setMap(me.map);
            // canvasLayer.render = me.update;
            me.zr = zrender.init(me.canvas);
            EE.emit('mapLoaded');
        });
        // me.map.on('click', function(e) {
        //     var ev = new MouseEvent('click', {
        //         view: window,
        //         bubbles: true,
        //         cancelable: true,
        //         screenX: e.pixel.x,
        //         screenY: e.pixel.y,
        //     });
        //     me.canvas.dispatchEvent(ev);
        // });

        me.canvas.addEventListener('mousedown', function(e) {
            function moveAt(pageX, pageY) {
                me.map.panBy(pageX, pageY);
            }
            function onMouseMove(event) {
                moveAt(event.movementX, event.movementY);
            }
            document.addEventListener('mousemove', onMouseMove);
            me.canvas.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                me.canvas.onmouseup = null;
            };
        });
        me.canvas.addEventListener('mousewheel', function(e) {
            let center = me.pix2gps(e.pageX, e.pageY);
            me.map.panTo(new AMap.LngLat(center.lng, center.lat));
            if (e.deltaY < 0) {
                me.map.zoomIn();
            } else {
                me.map.zoomOut();
            }
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

    // private update() {
    //     let that = this.extra ? this.extra : this;
    //     that.zr.clear();
    // }

    public gps2pix(lng: number, lat: number) {
        return this.map.lnglatTocontainer([lng, lat]);
    }

    public pix2gps(x: number, y: number) {
        return this.map.containerToLngLat(
            new AMap.Pixel(x, y),
            this.map.getZoom()
        );
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
