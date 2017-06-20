import { Row } from "./row";


export class Page {

    private selectionMode = false;
    private somethingSelected = false;

    constructor(private rows: Row[]) {
    }

    map(action: (row: Row) => void) {

        for (let row of this.rows) {
            action(row);
        }
    }

    rowsCount() {
        return this.rows.length;
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
