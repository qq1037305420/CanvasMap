/**
 * 坐标转换。
 *
 * 支持 GPS、GCJ、BD(Baidu) 三种坐标系。
 *
 * 坐标精度；保留六位小数。
 */
import _ from 'lodash';

const pi = 3.1415926535897932384626;
const xpi = (pi * 3000.0) / 180.0;
const a = 6378245.0;
const ee = 0.00669342162296594323;
interface IPoint {
    lng: number;
    lat: number;
}
export function transformLat(x: number, y: number): number {
    let ret =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x));
    ret +=
        ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) /
        3.0;
    ret +=
        ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) *
            2.0) /
        3.0;
    return ret;
}

export function transformLng(x: number, y: number): number {
    let ret =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x));
    ret +=
        ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) /
        3.0;
    ret +=
        ((150.0 * Math.sin((x / 12.0) * pi) +
            300.0 * Math.sin((x / 30.0) * pi)) *
            2.0) /
        3.0;
    return ret;
}

export function BD2GCJ(p: IPoint): IPoint {
    const x = p.lng - 0.0065;
    const y = p.lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xpi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xpi);
    const lng = z * Math.cos(theta);
    const lat = z * Math.sin(theta);
    return {lng, lat};
}

export function GCJ2BD(p: IPoint): IPoint {
    const x = p.lng;
    const y = p.lat;
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xpi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xpi);
    const lng = z * Math.cos(theta) + 0.0065;
    const lat = z * Math.sin(theta) + 0.006;
    return {lng, lat};
}

export function GPS2GCJ(p: IPoint): IPoint {
    let dlat = transformLat(p.lng - 105.0, p.lat - 35.0);
    let dlng = transformLng(p.lng - 105.0, p.lat - 35.0);

    const radLat = (p.lat / 180.0) * pi;
    let magic = Math.sin(radLat);

    magic = 1 - ee * magic * magic;

    const sqrtMagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
    dlng = (dlng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
    return {
        lng: p.lng + dlng,
        lat: p.lat + dlat,
    };
}

export function GCJ2GPS(p: IPoint): IPoint {
    const pp = GPS2GCJ(p);
    const lng = 2 * p.lng - pp.lng;
    const lat = 2 * p.lat - pp.lat;
    return {lng, lat};
}

export class Coord2Pix {
    maxLon: number;
    minLon: number;
    maxLat: number;
    minLat: number;
    h: number;
    w: number;
    scaleX: number;
    scaleY: number;
    constructor(
        maxLon: number,
        minLon: number,
        maxLat: number,
        minLat: number,
        h: number,
        w: number
    ) {
        this.maxLon = maxLon;
        this.minLon = minLon;
        this.maxLat = maxLat;
        this.minLat = minLat;
        this.h = h;
        this.w = w;
        this.scaleX = ((maxLon - minLon) * 3600) / w;
        this.scaleY = ((maxLat - minLat) * 3600) / h;
    }
    public corrd2pix(lng: number, lat: number) {
        let x = ((lng - this.minLon) * 3600) / this.scaleX;
        let y = ((this.maxLat - lat) * 3600) / this.scaleY;
        return {x: x, y: y};
    }
    public pix2corrd(x: number, y: number) {
        let lng = (x * this.scaleX) / 3600 + this.minLon;
        let lat = this.maxLat - (y * this.scaleY) / 3600;
        return {lng: lng, lat: lat};
    }
    public contain(x: number, y: number) {
        if (x < 0 || x > this.w) return false;
        if (y < 0 || y > this.h) return false;
        return true;
    }
}
