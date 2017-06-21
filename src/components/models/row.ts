import { Word } from "./word";
import { Rect } from "./base-types";

export class Row {

    private words: Word[] = [];

    private _line = '';
    private _rect: Rect;

    constructor(public readonly y: number = 0, public readonly height: number = 0) {
        this._rect = new Rect(0, y, 0, height);
    }

    length() {
        return this.words.length;
    }

    wordAt(index: number) {
        return this.words[index];
    }

    lastWord(): Word {
        let length = this.words.length;
        return this.words[length - 1];
    }

    map(action: (word: Word) => void) {

        for (let word of this.words) {
            action(word);
        }
    }

    pushWord(word: Word) {

        if (this.isEmpty()) {
            this._rect.x = word.x;
        }

        this.words.push(word);
        this._rect.width += word.width;
        this._line += word.word;

        word.attatchRow(this);
    }

    popWord(): Word {

        let word = this.words.pop();
        this._line = this._line.substring(0, this._line.length - 1);

        if (this.isEmpty()) {
            this._rect.width = 0;
        }
        else {
            this._rect.width -= word.width;
        }

        word.dettatchRow();

        return word;
    }

    isEmpty() {
        return this.words.length == 0;
    }

    line() {
        return this._line;
    }

    rect() {
        return this._rect;
    }

    selectionRect() {

        let selectionRect = new Rect(0xFFFF, this.y, 0, this.height);

        for (let word of this.words) {

            if (word.isSelected()) {

                if (word.x < selectionRect.x) {
                    selectionRect.x = word.x;
                }
                if (word.x + word.width > selectionRect.x + selectionRect.width) {
                    selectionRect.width = word.x + word.width - selectionRect.x;
                }
            }
        }

        return selectionRect;
    }
}
