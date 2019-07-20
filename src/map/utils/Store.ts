const GeoStore = require('terraformer-geostore').GeoStore;
const RTree = require('terraformer-rtree').RTree;
const Store = require('terraformer-geostore-memory');
import _ from 'lodash';

export class GEOSTORE {
    public store = new GeoStore({
        store: new Store.Memory(),
        index: new RTree(),
    });

    public add(json: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.store.add(json, function(err, res) {
                if (err || !_.isEmpty(err)) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    public update(json: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.store.update(json, function(err, res) {
                if (err || !_.isEmpty(err)) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    public remove(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.store.update(id, function(err, res) {
                if (err || !_.isEmpty(err)) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    public get(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.store.get(id, function(err, res) {
                if (err || !_.isEmpty(err)) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    public contains(json: any, search: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.store.contains(json, search, function(err: any, res: any[]) {
                if (err || !_.isEmpty(err)) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    public within(json: any, search: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.store.within(json, search, function(err: any, res: any[]) {
                if (err || !_.isEmpty(err)) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    public withinstream(json, func: Function): void {
        var stream = this.store.createReadStream();
        stream.on('data', e => {
            func(e);
        });
        this.store.within(json, {}, function(err: any, res: any[]) {});
    }
}

export interface Feature {
    type: 'Feature';
    id: string;
    properties?: any;
    geometry: GeoJSON.Geometry;
}

export interface FeatureCollection {
    type: 'FeatureCollection';
    id: string;
    properties?: any;
    features: Feature[];
}

export function FeatureBuilder(
    id: string,
    geometry: GeoJSON.Geometry,
    properties?: any
): Feature {
    return {
        id,
        properties,
        type: 'Feature',
        geometry,
    };
}

export function FeatureCollectionBuilder(
    id: string,
    properties: any,
    ...features: Feature[]
): FeatureCollection {
    return {
        type: 'FeatureCollection',
        id,
        properties,
        features,
    };
}
