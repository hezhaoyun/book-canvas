import { PaintConfig } from "./paint-config";
import { Page } from "../models/page";
import { Row } from "../models/row";
import { Word } from "../models/word";
import { BookDataProvider } from '../../providers/book-data/book-data';

export const REMARK_FLAG = '👀';

export class Painter {

    paintConfig: PaintConfig;

    constructor(private canvas: any) {
        this.paintConfig = new PaintConfig(canvas);
    }

    clipByMeasure(bookData: BookDataProvider): Row[] {

        let context = this.canvas.getContext('2d');
        this.paintConfig.style4Text(context);

        let lastMeasureWidth = 0;

        let row = new Row(this.paintConfig.y4Row(0), this.paintConfig.lineHeight);
        let rows: Row[] = [];

        while (bookData.hasMore()) {

            let remarks = bookData.retrieveRemarks();
            let theChar = (remarks.length > 0) ? REMARK_FLAG : bookData.nextChar();

            let measureWidth = context.measureText(row.line() + theChar).width;
            if (measureWidth <= this.paintConfig.contentWidth) {

                let wordWidth = measureWidth - lastMeasureWidth;

                let word = new Word(theChar, this.paintConfig.x4Word(lastMeasureWidth), wordWidth);
                word.setRemarks(remarks);
                row.pushWord(word);

                lastMeasureWidth = measureWidth;
                continue;
            }

            // Current char is ejected because overflow
            bookData.giveBack(remarks);

            let beginningChar = theChar;
            let endingChar = row.lastWord().word;

            while (BookDataProvider.beginningInappropriate(beginningChar) ||
                BookDataProvider.endingInappropriate(endingChar)) {

                let popped = row.popWord();
                bookData.giveBack(popped.remarks);

                beginningChar = popped.word;
                endingChar = row.lastWord().word;
            }

            rows.push(row);

            if (rows.length >= this.paintConfig.maxRows) {
                break;
            }

            row = new Row(this.paintConfig.y4Row(rows.length), this.paintConfig.lineHeight);
            lastMeasureWidth = 0;
        }

        // 最后一行没填满，但bookData没数据了
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
                    //this.paintConfig.style4RemarkFlag(context);
                    // context.fillText(word.word, word.x, word.rect().y);
                    //this.paintConfig.style4Text(context, page.isSelectionMode());

                    let rect = word.rect();
                    context.drawImage(
                        this.paintConfig.commentImage,
                        rect.x,
                        rect.y,
                        rect.width,
                        rect.height
                    );
                }
                else {
                    context.fillText(word.word, word.x, word.rect().y);
                }
            });
        });
    }
}
