import {MarkerBuilder} from './MarkerBuilder';
import {PathBuilder} from './PathBuilder';
import {TextBuilder} from './TextBuilder';
import paper from 'paper';
import LabeledMarker from './utils/LabeledMarker';
let worker = require('worker!./webWorker.ts');

interface elements {
    path: any[];
    marker: any[];
    text: any[];
}
export abstract class MapBase {
    public map: any;
    private elements: elements = {path: [], marker: [], text: []};
    public abstract init(container: HTMLElement | null): void;
    public abstract update(canvas?: any): void;
    public abstract gps2pix(lng: number, lat: number): any;
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
        paper.view.draw();
    }

    public addMarker(option: any) {
        if (!this.elements.marker) {
            this.elements.marker = [];
        }
        this.elements.marker.push(option);
    }

    public addPath(option: any) {
        if (!this.elements.path) {
            this.elements.path = [];
        }
        this.elements.path.push(option);
    }

    public addText(option: any) {
        if (!this.elements.text) {
            this.elements.text = [];
        }
        this.elements.text.push(option);
        // new TextBuilder(
        //     this.gps2pix(option.lng, option.lat),
        //     option.content
        // ).build();
        // this.redraw();
    }

    public drawMarker() {
        let markerChunks = _.chunk(this.elements.marker, 50);
        markerChunks.forEach(eachChunk => {
            console.log(worker);
            // worker.onmessage = function(event) {
            //     console.log(event);
            // };
            this.buildMarker(eachChunk);
            paper.view.draw();
        });
    }

    public buildMarker(markerChunk: any) {
        markerChunk.forEach(e => {
            if (e.content) {
                new LabeledMarker(
                    this.gps2pix(e.lng, e.lat),
                    e.iconUrl,
                    0,
                    e.content
                ).build();
            } else {
                const marker = new MarkerBuilder();
                marker.setIconUrl(e.iconUrl);
                marker.setPosition(this.gps2pix(e.lng, e.lat));
                marker.build();
            }
        });
    }
    public draw() {
        this.drawMarker();
        // this.elements.path.forEach(e => {
        //     let pathPixels = e.points.map(x => {
        //         return this.gps2pix(x.lng, x.lat);
        //     });
        //     new PathBuilder(pathPixels, e.pathType).build();
        // });
        // this.elements.text.forEach(e => {
        //     new TextBuilder(this.gps2pix(e.lng, e.lat), e.content).build();
        // });
    }
}
