import { PaintConfig } from "./paint-config";
import { Page } from "../models/page";
import { Row } from "../models/row";
import { Word } from "../models/word";

export class Painter {

    paintConfig: PaintConfig;

    constructor(private canvas: any) {
        this.paintConfig = new PaintConfig(canvas);
    }

    clipByMeasure(longText: string, indexStart = 0): Row[] {

        let context = this.canvas.getContext('2d');
        this.paintConfig.style4Text(context);

        let lastMeasureWidth = 0;

        let row = new Row(this.paintConfig.y4Row(0), this.paintConfig.lineHeight);
        let rows: Row[] = [];

        for (let i = indexStart; i < longText.length; i++) {

            let theChar = longText[i];

            let measureWidth = context.measureText(row.line() + theChar).width;
            if (measureWidth <= this.paintConfig.contentWidth) {

                let wordWidth = measureWidth - lastMeasureWidth;

                let remarks = this.retrieveRemarks(longText, i);

                if (remarks.length > 0) {

                    let word = new Word('👀', this.paintConfig.x4Word(lastMeasureWidth), wordWidth);

                    let skipWords = 0;

                    for (let remark of remarks) {
                        word.addRemark(remark);
                        skipWords += remark.length + 2;
                    }

                    row.pushWord(word);

                    i += skipWords - 1;
                }
                else {
                    row.pushWord(new Word(theChar, this.paintConfig.x4Word(lastMeasureWidth), wordWidth));
                }

                lastMeasureWidth = measureWidth;
                continue;
            }

            i--; // Current char is ejected because overflow

            let beginningChar = theChar;
            let endingChar = row.line().charAt(row.length() - 1);

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

    drawSelectionEffect(page: Page) {

        let context = this.canvas.getContext('2d');
        this.paintConfig.style4SelectionEffect(context);

        page.map(row => {
            let rect = row.selectionRect();
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
        });
    }

    drawText(page: Page) {

        let context = this.canvas.getContext('2d');
        this.paintConfig.style4Text(context, page.isSelectionMode());

        page.map(row => {

            row.map(word => {

                if (word.isRemarkFlag()) {
                    this.paintConfig.style4RemarkFlag(context);
                    context.fillText('👀', word.x, word.rect().y); // 💬👁‍🗨🔔📋👀🗞‍🗨
                    this.paintConfig.style4Text(context, page.isSelectionMode());
                }
                else {
                    context.fillText(word.word, word.x, word.rect().y);
                }
            });
        });
    }

    retrieveRemarks(longText: string, startIndex: number): string[] {

        let p = startIndex;
        let remarks: string[] = [];

        while (longText[p] == '【') {

            let endPosition = longText.indexOf('】', p + 1);
            if (endPosition < 0) break;

            let remark = longText.substring(p + 1, endPosition);

            remarks.push(remark);
            p = endPosition + 1;
        }

        return remarks;
    }

    static beginningInappropriate(c): boolean {
        return ":,.?!)]：，。？！…、）】”』".indexOf(c) > -1;
    }

    static endingInappropriate(c): boolean {
        return "([（【『“".indexOf(c) > -1;
    }
}
