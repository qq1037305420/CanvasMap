import {GPS2GCJ, GCJ2BD} from './coordinate';
import ENV from './utils/Env';
onmessage = params => {
    if (params.data.type === 'GCJ') {
        let converteddata = params.data.data.map(e => {
            return Object.assign(
                {},
                e,
                GPS2GCJ({lng: e.lng / 1000000, lat: e.lat / 1000000})
            );
        });
        postMessage(converteddata);
    } else if (params.data.type === 'BD') {
        let converteddata = params.data.data.map(e => {
            let gps = GPS2GCJ({lng: e.lng / 1000000, lat: e.lat / 1000000});
            return Object.assign({}, e, GCJ2BD({lng: gps.lng, lat: gps.lat}));
        });
        postMessage(converteddata);
    }
};
