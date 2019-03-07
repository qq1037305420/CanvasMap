import {Coord2Pix} from './coordinate';
import _ from 'lodash';
let coord2pix = null;
onmessage = params => {
    params = params.data;
    let buildData = params.data.buildData;
    coord2pix = new Coord2Pix(
        buildData.maxlng,
        buildData.minlng,
        buildData.maxlat,
        buildData.minlat,
        buildData.height,
        buildData.width
    );
    let data = params.data.markerData;
    let returningdata = _.filter(
        data.map(e => {
            let pix = coord2pix.corrd2pix(e.lng, e.lat);
            if (!coord2pix.contain(pix.x, pix.y)) return;
            return _.merge({}, pix, {icon: e.icon});
        }),
        e => {
            return e;
        }
    );
    postMessage(returningdata);
};
