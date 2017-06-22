import { Row } from "../models/row";
import { Word } from "../models/word";
import { Page } from "../models/page";
import { BookDataProvider } from '../../providers/book-data/book-data';

export const REMARK_FLAG = '批注';

export enum ContextFor {

    DRAW_TEXT,

    DRAW_SELECTION_TEXT,
    DRAW_SELECTION_BG,

    DRAW_REMARK_FLAG_TEXT,
    DRAW_REMARK_FLAG_BG,

    REUSE,
}

export class PaintConfig {

    static instance: PaintConfig = null;

    private prevContextFor: ContextFor;

    /**
     * 单位都是px(移动浏览器本身处理了dp的转换问题，px看起来等效于dp)
     * 由于 canvas 的 innerWidth 和 innerHeight 与 canvas 的 width 和 height 属性
     * 存在 pixelRatio 倍差异，实际绘图时会发生缩放，所以即使是 px，也需要换算，不然图像会比较模糊
     */

    Font = {
        fontSize: 18,
        lineHeight: 24,
        textFont: '18px san-serif',
    }

    PageRect = {
        marginX: 20,
        marginY: 30,
        contentWidth: 0,
        contentHeight: 0,
        width: 0,
        height: 0
    };

    Colors = {
        selectedTextBgColor: '#FAA',

        normalTextColor: '#C33',
        selectedTextColor: '#333',

        remarkFlagTextColor: '#FFF',
        remarkFlagBgColor: '#FAA',
    };

    maxRows = 0;

    static shared(canvas: any = null): PaintConfig {

        if (PaintConfig.instance == null) {
            
            if (canvas == null) return null;

            PaintConfig.instance = new PaintConfig(canvas);
        }

        return PaintConfig.instance;
    }

    private constructor(canvas: any) {
        let pixelRatio = PaintConfig.pixelRatio(canvas);
        this.config(canvas, pixelRatio);
    }

    config(canvas: any, pixelRatio: number) {

        this.Font.fontSize *= pixelRatio;
        this.Font.lineHeight *= pixelRatio;
        this.Font.textFont = `${this.Font.fontSize}px san-serif`;

        this.PageRect.width = canvas.width;
        this.PageRect.height = canvas.height;
        
        this.PageRect.marginX *= pixelRatio;
        this.PageRect.marginY *= pixelRatio;
        
        this.maxRows = Math.floor((canvas.height - this.PageRect.marginY * 2) / this.Font.lineHeight);

        this.PageRect.contentWidth = canvas.width - this.PageRect.marginX * 2;
        this.PageRect.contentHeight = this.maxRows * this.Font.lineHeight;
    }

    prepareContext(context: any, contextFor: ContextFor) {

        if (contextFor != this.prevContextFor) {

            switch (contextFor) {

                case ContextFor.DRAW_TEXT:
                    context.font = this.Font.textFont;
                    context.textBaseline = 'top';
                    context.fillStyle = this.Colors.normalTextColor;
                    break;

                case ContextFor.DRAW_SELECTION_TEXT:
                    context.font = this.Font.textFont;
                    context.textBaseline = 'top';
                    context.fillStyle = this.Colors.selectedTextColor;
                    break;

                case ContextFor.DRAW_SELECTION_BG:
                    context.fillStyle = this.Colors.selectedTextBgColor;
                    break;

                case ContextFor.DRAW_REMARK_FLAG_TEXT:
                    // this.context.font = this.Font.remarkFlagFont;
                    context.font = this.Font.textFont;
                    context.textBaseline = 'top';
                    context.fillStyle = this.Colors.remarkFlagTextColor;
                    break;

                case ContextFor.DRAW_REMARK_FLAG_BG:
                    context.fillStyle = this.Colors.remarkFlagBgColor;
                    break;

                case ContextFor.REUSE:
                    break;

                default:
                    break;
            }

            this.prevContextFor = contextFor;
        }
    }

    measureWidth(context: any, text: string, contextFor: ContextFor): number {
        this.prepareContext(context, contextFor);
        return context.measureText(text).width;
    }

    pagingByMeasure(context: any, bookData: BookDataProvider): Page[] {

        let pages: Page[] = [];

        while (bookData.hasMore()) {
            let page = this.generatePage(context, bookData);
            pages.push(page);
        }

        return pages;
    }

    generatePage(context: any, bookData: BookDataProvider): Page {

        let page = new Page();
        let row = new Row(this.y4Row(0), this.Font.lineHeight);

        let lastMeasureWidth = 0;

        while (bookData.hasMore()) {

            let remarks = bookData.retrieveRemarks();
            let theChar = (remarks.length > 0) ? REMARK_FLAG : bookData.nextChar();

            let measureWidth = this.measureWidth(context, row.line() + theChar, ContextFor.DRAW_TEXT);

            if (measureWidth <= this.PageRect.contentWidth) {

                let wordWidth = measureWidth - lastMeasureWidth;

                let word = new Word(theChar, this.xOffset(lastMeasureWidth), wordWidth);
                word.setRemarks(remarks);
                row.pushWord(word);

                lastMeasureWidth = measureWidth;
                continue;
            }

            // Current word is ejected because overflow
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

            page.pushRow(row);

            if (page.rowsCount() >= this.maxRows) {
                break;
            }

            row = new Row(this.y4Row(page.rowsCount()), this.Font.lineHeight);
            lastMeasureWidth = 0;
        }

        // 最后一行没填满，但bookData没数据了
        if (page.rowsCount() < this.maxRows && !row.isEmpty()) {
            page.pushRow(row);
        }

        return page;
    }

    y4Row(rowIndex: number) {
        return this.Font.lineHeight * rowIndex + this.PageRect.marginY;
    }

    xOffset(originX: number) {
        return this.PageRect.marginX + originX;
    }

    static pixelRatio(canvas: any) {

        let context = canvas.getContext('2d');

        // 屏幕的设备像素比
        var devicePixelRatio = window.devicePixelRatio || 1;

        // 浏览器在渲染canvas之前存储画布信息的像素比
        var backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        // canvas的实际渲染倍率
        return devicePixelRatio / backingStoreRatio;
    }
}
