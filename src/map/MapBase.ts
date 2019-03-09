import {MarkerBuilder} from './MarkerBuilder';
import LabeledMarker from './LabeledMarker';
import _ from 'lodash';
import Env from './utils/Env';
import zrender from 'zrender';
import geojson from 'geojson';
// import PixelWorker from 'worker-loader!@/map/Worker.js';
import * as Terraformer from 'terraformer';
import {GEOSTORE} from '@/map/utils/DataSet';
import Supercluster from 'supercluster';
var geojsonCoords = require('@mapbox/geojson-coords');

export abstract class MapBase {
    public map: any;
    public zr: any;
    public worker: any;
    // public totalPoints: any[] = [];
    public SuperCluster = new Supercluster({
        radius: 400,
        maxZoom: 16,
    });
    public abstract init(container: HTMLElement | null): void;
    public abstract gps2pix(lng: number, lat: number): object | null;
    public abstract getBounds(): any;
    /**
     * Map Control Group
     */
    public abstract addScale(): void;
    public abstract addMapType(): void;
    public abstract addToolBar(): void; // NavigationControl ToolBar
    public abstract addOverView(): void; // OverView MapControl
    public abstract addGeolocation(): void; // geolocation

    public draw() {
        this.drawMarker();
        this.zr.flush();
    }

    public addMarker(option: any) {
        GEOSTORE.add(
            new Terraformer.Feature({
                type: 'Feature',
                id: option.id,
                properties: {icon: option.icon, type: option.eventName},
                geometry: {
                    type: 'Point',
                    coordinates: [option.lng, option.lat],
                },
            })
        );
    }

    private drawMarker() {
        this.SuperCluster.load(Object.values(GEOSTORE.store.data));
        let bounds = this.getBounds();
        let clusterData = this.SuperCluster.getClusters(
            [bounds.minlng, bounds.minlat, bounds.maxlng, bounds.maxlat],
            bounds.zoom
        );
        clusterData.forEach(element => {
            let elementPoints = geojsonCoords(element);
            if (
                element.type === 'Feature' &&
                element.geometry.type === 'Point'
            ) {
                let pix = this.gps2pix(
                    elementPoints[0][0],
                    elementPoints[0][1]
                );
                if (_.isEmpty(pix)) return;
                if (element.properties.cluster === true) {
                    let clusterCount = element.properties.point_count;
                    this.zr.add(
                        new zrender.Circle({
                            shape: {
                                cx: pix.x,
                                cy: pix.y,
                                r: 30,
                            },
                            style: {
                                fill: 'none',
                                stroke: '#F00',
                                text: clusterCount,
                            },
                        })
                    );
                } else {
                    this.zr.add(
                        new zrender.Image({
                            style: {
                                image: Env.IMG_URL + element.properties.icon,
                                x: pix.x,
                                y: pix.y,
                            },
                        })
                    );
                }
            }
        });
    }
}
