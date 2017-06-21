import { Row } from './row';
import { Rect } from './base-types';

export class Word {

	private row: Row;
	private selected = false;

	private _rect: Rect;
	private _remarks: string[] = [];

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
		return this._remarks.length > 0;
	}

	setRemarks(remarks: string[]) {
		this._remarks = remarks;
	}

	remarkCount() {
		return this._remarks.length;
	}

	remarkAt(index: number) {
		return this._remarks[index];
	}

	remarkMap(action: (remark: string) => void) {

		for (let remark of this._remarks) {
			action(remark);
		}
	}

	get remarks(): string[] {
		return this._remarks;
	}
}
