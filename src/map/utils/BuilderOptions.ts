import _ from 'lodash';
interface CommonOptions {
    id: string;
    lng: number;
    lat: number;
    offsetX?: number;
    offsetY?: number;
    icon?: string;
    extra?: any;
    scale?: number;
    rotate?: number;
}
const DEFAULT_COMMON_OPTIONS = {
    lng: -1,
    lat: -1,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotate: 0,
    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
};
export interface EmpOptions extends CommonOptions {
    content?: string;
    eventName?: string;
}
export const DEFAULT_EMP_OPTIONS = _.merge({}, DEFAULT_COMMON_OPTIONS, {
    content: '',
    eventName: 'emp',
});
