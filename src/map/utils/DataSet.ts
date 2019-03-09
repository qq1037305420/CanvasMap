const GeoStore = require('terraformer-geostore').GeoStore;
const RTree = require('terraformer-rtree').RTree;
const Store = require('terraformer-geostore-memory');

export const GEOSTORE = new GeoStore({
    store: new Store.Memory(),
    index: new RTree(),
});
