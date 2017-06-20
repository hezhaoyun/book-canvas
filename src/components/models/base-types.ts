
export class Point {
	constructor(public x: number, public y: number) {
	}
}

export class Rect {

	constructor(public x: number, public y: number, public width: number, public height: number) {
	}

	contains(point: Point): boolean {
		return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.width;
	}

	center(): Point {
		return new Point(this.x + this.width / 2, this.y + this.height / 2);
	}

	innerSquareRadius(): number {
		return Math.min(this.width, this.height) / 2;
	}
}