import paper from 'paper';

export interface Position {
    x: number;
    y: number;
}

export enum PathType {
    CIRCLE = 'CIRCLE',
    RECTANGLE = 'RECTANGLE',
    LINE = 'LINE',
}

export class PathBuilder {
    private position: Position[] = [];
    private pathType: PathType = PathType.LINE;
    public constructor(positions: Position[], pathType: PathType) {
        this.position = positions;
        this.pathType = pathType;
    }
    public getPosition() {
        return this.position;
    }
    public setPosition(positions: Position[]) {
        this.position = positions;
    }
    public getPathType() {
        return this.pathType;
    }
    public setPathType(pathType: PathType) {
        this.pathType = pathType;
    }
    public build() {
        let points = this.position.map(e => {
            return new paper.Point(e.x, e.y);
        });
        const thisPath = new paper.Path(points);
        thisPath.strokeColor = 'black';
        switch (this.pathType) {
            case PathType.CIRCLE:
                thisPath.smooth();
                break;
            case PathType.RECTANGLE:
                thisPath.closed = true;
                break;
            default:
                break;
        }
        return thisPath;
    }
}
