import { Row } from "./row";

export class Page {

    private rows: Row[] = [];
    private selectionMode = false;
    private somethingSelected = false;

    constructor() {
    }

    map(action: (row: Row) => void) {

        for (let row of this.rows) {
            action(row);
        }
    }

    rowsCount() {
        return this.rows.length;
    }

    pushRow(row: Row) {
        this.rows.push(row);
    }

    rowAt(index: number) {
        return this.rows[index];
    }

    isSelectionMode() {
        return this.selectionMode;
    }

    enterSelectionMode() {
        this.selectionMode = true;
    }

    leaveSelectionMode() {
        this.selectionMode = false;
        this.somethingSelected = false;
    }

    isSomethingSelected() {
        return this.somethingSelected;
    }

    setSomethingSelected(selected = true) {
        this.somethingSelected = selected;
    }
}
