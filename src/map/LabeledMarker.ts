import paper from 'paper';
export default class LabeledMarker {
    private position: any = {x: -1, y: -1};
    private rotate: number = 0;
    private iconUrl: string =
        'http://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png';
    private content: string = '';
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
        return returningGroup;
    }
}
