export interface CircleOption {
    x: number;
    y: number;
    radius: number;
}

export interface MarkerOption {
    lng: number;
    lat: number;
    offsetX?: number;
    offsetY?: number;
    iconUrl: string;
}

export interface Point {
    lng: number;
    lat: number;
}
