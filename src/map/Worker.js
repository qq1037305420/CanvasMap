import {GPS2GCJ} from './coordinate';
import _ from 'lodash';
import ENV from './utils/Env';
onmessage = params => {
    if (params.data.type === 'GCJ') {
        let converteddata = params.data.data.map(e => {
            return _.merge(
                {},
                e,
                GPS2GCJ({lng: e.lng / 1000000, lat: e.lat / 1000000})
            );
        });
        postMessage(converteddata);
    }
};
