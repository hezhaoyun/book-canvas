import { Row } from './row';
import { Rect } from './base-types';

export class Word {

	private row: Row;
	private selected = false;

	private _rect: Rect;
	private _remark: string[] = [];

	constructor(public readonly word: string, public readonly x: number, public readonly width: number) {
		this._rect = new Rect(x, 0, width, 0);
	}

	attatchRow(row: Row) {
		this.row = row;
		this._rect.y = row.y;
		this._rect.height = row.height;
	}

	dettatchRow() {
		this.row = null;
		this._rect.y = 0;
		this._rect.height = 0;
	}

	setSelected(selected = true) {
		this.selected = selected;
	}

	isSelected() {
		return this.selected;
	}

	rect(): Rect {
		return this._rect;
	}

	isRemarkFlag(): boolean {
		return this._remark.length > 0;
	}

	remarkCount() {
		return this._remark.length;
	}

	addRemark(remark: string) {
		this._remark.push(remark);
	}

	remarkAt(index: number) {
		return this._remark[index];
	}
}
