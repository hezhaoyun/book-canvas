import {Painter} from "./painter";
import {Page} from "../models/page";
import {Point} from '../models/base-types';

/**
 * Created by hezhaoyun on 2017/6/16.
 */

export class PageController {

  private startPoint: Point;

  constructor(private page: Page, public painter: Painter) {
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

    if (!this.isSelectionMode()) {
      return false;
    }

    if (this.page.isSomethingSelected()) {
      this.clearSelection(true);
      return true;
    }

    this.startPoint = point;

    return true;
  }

  onTouchMove(point: Point): boolean {

    if (!this.isSelectionMode()) {
      return false;
    }

    if (this.page.isSomethingSelected()) {
      return true;
    }

    this.selectRange(this.startPoint, point);

    return true;
  }

  onTouchEnd(point: Point): boolean {

    if (!this.isSelectionMode()) {
      return false;
    }

    if (this.page.isSomethingSelected()) {
      this.page.setSomethingSelected(false);
    }
    else {
      this.selectRange(this.startPoint, point);
      this.page.setSomethingSelected();
    }

    return true;
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
  }

  private rowsAffected(startPoint, endPoint: Point): number[] {

    let startRowIndex = -1;
    let endRowIndex = -1;

    for (let i = 0; i < this.page.rowsCount(); i++) {

      let row = this.page.rowAt(i);

      if (startRowIndex < 0 && startPoint.y >= row.y && startPoint.y <= row.y + row.height) {
        startRowIndex = i;
      }

      if (endRowIndex < 0 && endPoint.y >= row.y && endPoint.y <= row.y + row.height) {
        endRowIndex = i;
      }

      if (startRowIndex > -1 && endRowIndex > -1) break;
    }

    return [startRowIndex, endRowIndex];
  }

  private selectCrossRows(startRowIndex: number, endRowIndex: number, startPoint: Point, endPoint: Point) {

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
      else if (word.x < startPoint.x && word.x + word.width > startPoint.x) {
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
      else if (word.x < endPoint.x && word.x + word.width > endPoint.x) {
        capGot = true;
        word.setSelected();
      }
    }
  }

  private selectOnSingleRow(startPoint: Point, endPoint: Point, rowIndex: number) {

    let startX = Math.min(startPoint.x, endPoint.x);
    let endX = Math.max(startPoint.x, endPoint.x);

    this.page.rowAt(rowIndex).map(word => {
      if (word.x + word.width > startX && word.x < endX) {
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

    if (redraw) {
      this.draw();
    }
  }
}