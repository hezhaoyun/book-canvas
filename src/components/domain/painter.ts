import {PaintConfig} from "./paint-config";
import {Page} from "../models/page";
import {Row} from "../models/row";
import {Word} from "../models/word";

export class Painter {

  paintConfig: PaintConfig;

  constructor(private canvas: any) {
    this.paintConfig = new PaintConfig(canvas);
  }

  clipByMeasure(longText: string, indexStart = 0): Row[] {

    let context = this.canvas.getContext('2d');
    this.paintConfig.applyTextStyle(context);

    let lastMeasureWidth = 0;

    let row = new Row(this.paintConfig.y4Row(0), this.paintConfig.lineHeight);
    let rows: Row[] = [];

    for (let i = indexStart; i < longText.length; i++) {

      let nextChar = longText[i];

      let measureWidth = context.measureText(row.asLine() + nextChar).width;
      if (measureWidth <= this.paintConfig.contentWidth) {

        let wordWidth = measureWidth - lastMeasureWidth;

        row.pushWord(
          new Word(nextChar, this.paintConfig.x4Word(lastMeasureWidth), wordWidth)
        );

        lastMeasureWidth = measureWidth;

        continue;
      }

      i--; // Current char is ejected because overflow

      let beginningChar = nextChar;
      let endingChar = row.asLine().charAt(row.length() - 1);

      while (Painter.beginningInappropriate(beginningChar) || Painter.endingInappropriate(endingChar)) {

        beginningChar = row.popWord().word;
        endingChar = row.wordAt(row.length() - 1).word;

        i--;
      }

      rows.push(row);

      if (rows.length >= this.paintConfig.maxRows) {
        break;
      }

      row = new Row(this.paintConfig.y4Row(rows.length), this.paintConfig.lineHeight);
      lastMeasureWidth = 0;
    }

    if (rows.length < this.paintConfig.maxRows && !row.isEmpty()) {
      rows.push(row);
    }

    return rows;
  }

  draw(page: Page) {

    let context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (page.isSelectionMode()) {
      this.drawSelectionEffect(page);
    }

    this.drawText(page);
  }

  private drawSelectionEffect(page: Page) {

    let context = this.canvas.getContext('2d');
    this.paintConfig.applyTextBgStyle(context);

    page.map(row => {
      row.map(word => {
        if (word.isSelected()) {
          context.fillRect(word.x, row.y, word.width, row.height);
        }
      });
    });
  }

  private drawText(page: Page) {

    let context = this.canvas.getContext('2d');
    this.paintConfig.applyTextStyle(context, page.isSelectionMode());

    page.map(row => {
      if (!row.isEmpty()) {
        context.fillText(row.asLine(), row.firstWordX(), row.y);
      }
    });
  }

  static beginningInappropriate(c): boolean {
    return ":,.?!)]：，。？！…、）】”』".indexOf(c) > -1;
  }

  static endingInappropriate(c): boolean {
    return "([（【『“".indexOf(c) > -1;
  }
}
