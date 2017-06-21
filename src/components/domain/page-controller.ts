import { Painter } from "./painter";
import { Page } from "../models/page";
import { Point } from '../models/base-types';
import { Word } from '../models/word';
import { AlertController } from 'ionic-angular';

export class PageController {

    private startPoint: Point;

    constructor(private page: Page, public painter: Painter, public alertCtrl: AlertController) {
    }

    isSelectionMode() {
        return this.page.isSelectionMode();
    }

    enterSelectionMode() {

        this.page.enterSelectionMode();
        this.draw();
    }

    leaveSelectionMode() {

        this.page.leaveSelectionMode();
        this.clearSelection();

        this.draw();
    }

    draw() {
        this.painter.draw(this.page);
    }

    onTouchStart(point: Point): boolean {

        if (this.isSelectionMode()) {

            if (this.page.isSomethingSelected()) {
                this.clearSelection(true);
                return true;
            }

            this.startPoint = point;

            return true;
        }
        else {
            this.page.map(row => {

                if (row.rect().contains(point)) {
                    
                    row.map(word => {
                        if (word.rect().contains(point) && word.isRemarkFlag()) {
                            this.showRemarks(word);
                            return true;
                        }
                    });
                }
            });
        }

        return false;
    }

    onTouchMove(point: Point): boolean {

        if (this.isSelectionMode()) {

            if (this.startPoint == null) {
                return true;
            }

            this.selectRange(this.startPoint, point);

            return true;
        }

        return false;
    }

    onTouchEnd(point: Point): boolean {

        if (this.isSelectionMode()) {

            if (this.startPoint == null) {
                return true;
            }

            this.selectRange(this.startPoint, point);

            this.startPoint = null;

            return true;
        }

        return false;
    }

    showRemarks(word: Word) {

        if (word.remarkCount() == 1) {

            let remark = word.remarkAt(0);
            let [title, content] = this.splitRemark(remark);

            this.showBaseAlert(title, content);
        }
        else {

            let alert = this.alertCtrl.create();
            alert.setTitle('选择批注');

            word.remarkMap(remark => {

                let [title,] = this.splitRemark(remark);

                alert.addInput({
                    type: 'radio',
                    label: title,
                    value: remark,
                    checked: false
                });
            });

            alert.addButton('Cancel');
            alert.addButton({
                text: 'OK',
                handler: data => {
                    let [title, content] = this.splitRemark(data);
                    this.showBaseAlert(title, content);
                }
            });

            alert.present();
        }
    }

    showBaseAlert(title: string, content: string) {

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: content,
            buttons: ['OK']
        });

        alert.present();
    }

    splitRemark(remark: string): [string, string] {

        let position = remark.indexOf('：');

        let title: string;
        let content: string;

        if (position > -1) {
            title = remark.substring(0, position);
            content = remark.substring(position + 1);
        }
        else {
            title = '批注';
            content = remark;
        }

        return [title, content];
    }

    selectRange(startPoint: Point, endPoint: Point) {

        let [startRowIndex, endRowIndex] = this.rowsAffected(startPoint, endPoint);
        if (startRowIndex < 0 || endRowIndex < 0) return;

        this.clearSelection();

        if (startRowIndex != endRowIndex) {
            this.selectCrossRows(startRowIndex, endRowIndex, startPoint, endPoint);
        }
        else {
            this.selectOnSingleRow(startPoint, endPoint, startRowIndex);
        }

        this.draw();

        this.page.setSomethingSelected();
    }

    rowsAffected(startPoint, endPoint: Point): number[] {

        let startRowIndex = -1;
        let endRowIndex = -1;

        for (let i = 0; i < this.page.rowsCount(); i++) {

            let row = this.page.rowAt(i);

            if (startRowIndex == -1 && row.rect().contains(startPoint)) {
                startRowIndex = i;
            }

            if (endRowIndex == -1 && row.rect().contains(endPoint)) {
                endRowIndex = i;
            }

            if (startRowIndex > -1 && endRowIndex > -1) break;
        }

        return [startRowIndex, endRowIndex];
    }

    selectCrossRows(startRowIndex: number, endRowIndex: number, startPoint: Point, endPoint: Point) {

        if (startRowIndex > endRowIndex) {
            [startRowIndex, endRowIndex] = [endRowIndex, startRowIndex];
            [startPoint, endPoint] = [endPoint, startPoint];
        }

        let capGot = false;
        let startRow = this.page.rowAt(startRowIndex);

        startRow.map(word => {
            if (capGot) {
                word.setSelected();
            }
            else if (word.rect().contains(startPoint)) {
                capGot = true;
                word.setSelected();
            }
        });

        for (let i = startRowIndex + 1; i < endRowIndex; i++) {

            this.page.rowAt(i).map(word => {
                word.setSelected();
            });
        }

        capGot = false;
        let endRow = this.page.rowAt(endRowIndex);

        for (let i = endRow.length() - 1; i >= 0; i--) {

            let word = endRow.wordAt(i);

            if (capGot) {
                word.setSelected();
            }
            else if (word.rect().contains(endPoint)) {
                capGot = true;
                word.setSelected();
            }
        }
    }

    selectOnSingleRow(startPoint: Point, endPoint: Point, rowIndex: number) {

        let startX = Math.min(startPoint.x, endPoint.x);
        let endX = Math.max(startPoint.x, endPoint.x);

        this.page.rowAt(rowIndex).map(word => {
            if (startX < word.x + word.width && word.x < endX) {
                word.setSelected();
            }
        });
    }

    clearSelection(redraw = false) {

        this.page.map(row => {
            row.map(word => {
                word.setSelected(false);
            });
        });

        this.page.setSomethingSelected(false);

        if (redraw) {
            this.draw();
        }
    }
}
