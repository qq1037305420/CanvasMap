import paper from 'paper';

export interface Position {
    x: number;
    y: number;
}
export class TextBuilder {
    private position: Position = {x: -1, y: -1};
    private content: string = '';
    public constructor(position: Position, content: string) {
        this.setPosition(position);
        this.setContent(content);
    }
    public getPosition() {
        return this.position;
    }
    public setPosition(position: Position) {
        this.position = position;
    }
    public getContent() {
        return this.content;
    }
    public setContent(content: string) {
        this.content = content;
    }
    public build() {
        const thisText = new paper.PointText(
            new paper.Point(this.position.x, this.position.y)
        );
        thisText.fillColor = 'red';
        thisText.fontSize = 50;
        thisText.content = this.content;
        return thisText;
    }
}
