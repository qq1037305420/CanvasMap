import paper from 'paper';
import _ from 'lodash';
export interface Position {
    x: number;
    y: number;
}
export class MarkerBuilder {
    private position: Position = {x: -1, y: -1};
    private rotate: number = 0;
    private iconUrl: string =
        'http://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png';
    public getIconUrl() {
        return this.iconUrl;
    }
    public setIconUrl(iconUrl: string) {
        this.iconUrl = iconUrl;
    }
    public getRotate() {
        return this.rotate;
    }
    public setRotate(rotate: number) {
        this.rotate = rotate;
    }
    public getPosition() {
        return this.position;
    }
    public setPosition(position: Position) {
        this.position = position;
    }
    public build() {
        let markerimage = document.createElement('img');
        markerimage.crossOrigin = '';
        markerimage.src = this.iconUrl;
        const thisMarker = new paper.Raster(
            markerimage,
            new paper.Point(this.position.x, this.position.y)
        );
        thisMarker.onClick = function(event) {
            console.log('you clicked at ' + event.point);
        };
        thisMarker.rotate(this.rotate);
        // thisMarker.on('load', () => {
        //     for (var y = 0; y < thisMarker.height; y++) {
        //         for (var x = 0; x < thisMarker.width; x++) {
        //             if (thisMarker.getPixel(x, y).alpha != 0) {
        //                 thisMarker.setPixel(x, y, new paper.Color(255, 0, 0))
        //             }
        //         }
        //     }
        // })
        return thisMarker;
    }
}
