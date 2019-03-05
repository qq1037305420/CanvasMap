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
        'http://file2.5ihw.cn:9033/comm/image/sys/592826448b27db1427dec143';
    private content?: string | null = null;
    public constructor(
        position: Position,
        iconUrl?: string,
        rotate?: number,
        content?: string
    ) {
        this.position = position;
        if (iconUrl) {
            this.iconUrl = iconUrl!;
        }
        if (rotate) {
            this.rotate = rotate!;
        }
        if (content) {
            this.content = content;
        }
    }
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
        let returningGroup = new paper.Group();
        let markerimage = document.createElement('img');
        markerimage.crossOrigin = '';
        markerimage.src = this.iconUrl;
        const thisMarker = new paper.Raster(
            markerimage,
            new paper.Point(this.position.x, this.position.y)
        );
        thisMarker.rotate(this.rotate);
        returningGroup.addChild(thisMarker);
        if (this.content) {
            const thisText = new paper.PointText(
                new paper.Point(
                    this.position.x - thisMarker.width / 2,
                    this.position.y - thisMarker.height
                )
            );
            thisText.content = this.content;
            thisText.fontSize = 15;
            var thisRect = new paper.Path.Rectangle(thisText.bounds.scale(1.2));
            thisRect.fillColor = 'white';
            thisRect.strokeColor = 'blue';
            returningGroup.addChild(thisRect);
            returningGroup.addChild(thisText);
        }
        // thisMarker.on('load', () => {
        //     for (var y = 0; y < thisMarker.height; y++) {
        //         for (var x = 0; x < thisMarker.width; x++) {
        //             if (thisMarker.getPixel(x, y).alpha != 0) {
        //                 thisMarker.setPixel(x, y, new paper.Color(255, 0, 0))
        //             }
        //         }
        //     }
        // })
        return returningGroup;
    }
}
