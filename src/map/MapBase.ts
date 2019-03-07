import {MarkerBuilder} from './MarkerBuilder';
import paper from 'paper';
import LabeledMarker from './LabeledMarker';
import _ from 'lodash';
import Env from './utils/Env';
interface elements {
    path: any[];
    marker: any[];
    text: any[];
}
export abstract class MapBase {
    public map: any;
    private elements: elements = {path: [], marker: [], text: []};
    public abstract init(container: HTMLElement | null): void;
    public abstract gps2pix(lng: number, lat: number): paper.Point | null;
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
        paper.project.activeLayer.removeChildren();
        this.draw();
    }
    public draw() {
        this.drawMarker();
        paper.view.draw();
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
        let marker = new MarkerBuilder();
        marker.setPosition({x: -100, y: -100});
        marker.setIconUrl(key.indexOf('http') < 0 ? Env.IMG_URL + key : key);
        let ppmarker = marker.build();
        _.filter(
            markerChunk.map(e => {
                return this.gps2pix(e.lng, e.lat);
            }),
            e => {
                return e;
            }
        ).forEach(pix => {
            let symbol = new paper.Symbol(ppmarker);
            symbol = symbol.place(pix);
        });
        // markerChunk.forEach(e => {
        //     if (_.isEmpty(pix)) return;

        //     // if (e.content) {
        //     //     new LabeledMarker(pix, e.iconUrl, 0, e.content).build();
        //     // } else {
        //     //     let newmarker = ppmarker.clone({insert: true, deep: false});
        //     //     newmarker.position = pix;
        //     //     // newmarker.onClick = function(event) {
        //     //     //     console.log(event.point);
        //     //     // };
        //     // }
        // });
    }
}
