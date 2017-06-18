/**
 * Created by hezhaoyun on 2017/6/16.
 */

export class PaintConfig {

  contentWidth: number;
  lineHeight: number;
  maxRows: number;

  selectedTextBgColor = '#FAA';

  normalTextColor = '#c33';
  selectionModeTextColor = '#333';

  constructor(canvas: any, public marginX = 20, public marginY = 30, public fontSize = 18) {

    this.contentWidth = canvas.width - this.marginX * 2;
    this.lineHeight = Math.ceil(this.fontSize * 1.5);
    this.maxRows = Math.floor((canvas.height - this.marginY * 2) / this.lineHeight);

    console.log(`canvase.height:${canvas.height}, lineHeight: ${this.lineHeight}, maxRows: ${this.maxRows}`);
  }

  applyTextStyle(context: any, selectionMode = false) {

    if (selectionMode) {
      context.fillStyle = this.selectionModeTextColor;
    }
    else {
      context.fillStyle = this.normalTextColor;
    }

    context.font = `${this.fontSize}px san-serif`;
    context.textBaseline = 'top';
  }

  applyTextBgStyle(context: any) {
    context.fillStyle = this.selectedTextBgColor;
  }

  y4Row(rowIndex: number) {
    return this.lineHeight * rowIndex + this.marginY;
  }

  x4Word(originX: number) {
    return this.marginX + originX;
  }
}
