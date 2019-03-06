/* global AMap */
import {MapBase} from './MapBase';
import _ from 'lodash';
import {GPS2GCJ} from './coordinate';
import EE from './EventBus';
import paper from 'paper';

export default class AmapCanvas extends MapBase {
    private extra: any;
    private paper: any;
    private canvas: any;
    public init(container: HTMLDivElement) {
        const me = this;
        me.map = new AMap.Map(container, {
            zoom: 12,
        });
        me.canvas = document.createElement('canvas');
        me.map.on('complete', function() {
            EE.emit('mapLoaded');
            me.canvas.width = me.map.getSize().width;
            me.canvas.height = me.map.getSize().height;
            // 将 canvas 宽高设置为地图实例的宽高
            var canvasLayer = new AMap.CustomLayer(me.canvas, {zIndex: 200});
            canvasLayer.extra = me;
            canvasLayer.setMap(me.map);
            canvasLayer.render = me.update;
        });
    }

    private update() {
        if (!this.extra.paper) {
            this.extra.paper = paper.setup(this.extra.canvas);
        } else {
            paper.project.activeLayer.removeChildren();
        }
        this.extra.draw();
    }

    public gps2pix(lng: number, lat: number) {
        let gps = GPS2GCJ({lng: lng / 1000000, lat: lat / 1000000});
        var pix = this.map.lnglatTocontainer([gps.lng, gps.lat]);
        if (paper.view.bounds.contains(new paper.Point(pix.x, pix.y))) {
            return {x: pix.x, y: pix.y};
        }
        return null;
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
