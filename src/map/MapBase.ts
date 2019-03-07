import {MarkerBuilder} from './MarkerBuilder';
import LabeledMarker from './LabeledMarker';
import _ from 'lodash';
import Env from './utils/Env';
import zrender from 'zrender';

interface elements {
    path: any[];
    marker: any[];
    text: any[];
}
export abstract class MapBase {
    public map: any;
    public zr: any;
    private elements: elements = {path: [], marker: [], text: []};
    public abstract init(container: HTMLElement | null): void;
    public abstract gps2pix(lng: number, lat: number): object | null;
    public abstract gpsCoor(lng: number, lat: number): any;
    /**
     * Map Control Group
     */
    public abstract addScale(): void;
    public abstract addMapType(): void;
    public abstract addToolBar(): void; // NavigationControl ToolBar
    public abstract addOverView(): void; // OverView MapControl
    public abstract addGeolocation(): void; // geolocation

    public redraw() {
        this.draw();
    }
    public draw() {
        this.drawMarker();
        this.zr.flush();
    }

    public addMarker(option: any) {
        let gps = this.gpsCoor(option.lng, option.lat);
        option.lng = gps.lng;
        option.lat = gps.lat;
        this.elements.marker.push(option);
    }

    public addPath(option: any) {
        let gps = this.gpsCoor(option.lng, option.lat);
        option.lng = gps.lng;
        option.lat = gps.lat;
        this.elements.path.push(option);
    }

    public addText(option: any) {
        let gps = this.gpsCoor(option.lng, option.lat);
        option.lng = gps.lng;
        option.lat = gps.lat;
        this.elements.text.push(option);
    }

    private drawMarker() {
        let markerChunks = _.groupBy(this.elements.marker, 'icon');
        for (let key in markerChunks) {
            this.buildMarker(key, markerChunks[key]);
        }
    }

    private buildMarker(key: string, markerChunk: any) {
        _.filter(
            markerChunk.map(e => {
                let pix = this.gps2pix(e.lng, e.lat);
                if (_.isEmpty(pix)) return;
                return _.merge({}, pix, {icon: e.icon});
            }),
            e => {
                return e;
            }
        ).forEach(pix => {
            this.zr.add(
                new zrender.Image({
                    style: {
                        image: Env.IMG_URL + pix.icon,
                        x: pix.x,
                        y: pix.y,
                    },
                })
            );
        });
    }
}
