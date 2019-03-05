import AmapCanvas from './AmapCanvas';
import BmapCanvas from './BmapCanvas';
import {MapBase} from './MapBase';

export default class MapFactory {
    public readonly MapType = {
        amap: AmapCanvas,
        bmap: BmapCanvas,
    };

    public createMapObj(type: any): MapBase {
        return this.createObj(this.MapType[type]);
    }

    private createObj<T extends MapBase>(c: new () => T): T {
        let d = new c();
        return d;
    }
}
