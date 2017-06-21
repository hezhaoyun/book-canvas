/**
 * Created by hezhaoyun on 2017/6/16.
 */

export class PaintConfig {

    contentWidth: number;
    lineHeight: number;
    maxRows: number;

    selectedTextBgColor = '#FAA';
    remarkFlagColor = '#F00';

    normalTextColor = '#C33';
    selectionModeTextColor = '#333';

    constructor(private canvas: any, public marginX = 20, public marginY = 30, public fontSize = 18) {

        let pixelRatio = PaintConfig.pixelRatio(canvas);

        this.marginX *= pixelRatio;
        this.marginY *= pixelRatio;
        this.fontSize *= pixelRatio;

        this.contentWidth = canvas.width - this.marginX * 2;
        this.lineHeight = Math.ceil(this.fontSize * 1.5);
        this.maxRows = Math.floor((canvas.height - this.marginY * 2) / this.lineHeight);
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

    style4Text(context: any, selectionMode = false) {

        if (selectionMode) {
            context.fillStyle = this.selectionModeTextColor;
        }
        else {
            context.fillStyle = this.normalTextColor;
        }

        context.font = `${this.fontSize}px san-serif`;
        context.textBaseline = 'top';
    }

    style4RemarkFlag(context: any) {
        context.font = `${this.fontSize}px iconfont`;
    }

    style4SelectionEffect(context: any) {
        context.fillStyle = this.selectedTextBgColor;
    }

    y4Row(rowIndex: number) {
        return this.lineHeight * rowIndex + this.marginY;
    }

    x4Word(originX: number) {
        return this.marginX + originX;
    }
}
