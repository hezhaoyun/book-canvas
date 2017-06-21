import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Painter } from '../domain/painter';
import { PaintConfig } from '../domain/paint-config';
import { BookDataProvider } from '../../providers/book-data/book-data';
import { Page } from "../models/page";
import { PageController } from "../domain/page-controller";
import { Point } from "../models/base-types";

@Component({
    selector: 'book-canvas',
    templateUrl: 'book-canvas.html'
})
export class BookCanvasComponent {

    @ViewChild('bookCanvas') canvasElement: ElementRef;
    canvas: any;
    page: Page;
    painter: Painter;
    pageController: PageController;

    private pixelRatio = 1;

    constructor(public platform: Platform, public renderer: Renderer2, private bookData: BookDataProvider, public alertCtrl: AlertController) {
    }

    ngAfterViewInit() {

        this.canvas = this.canvasElement.nativeElement;

        this.pixelRatio = PaintConfig.pixelRatio(this.canvas);

        this.renderer.setAttribute(this.canvas, 'width', this.platform.width() * this.pixelRatio + '');
        this.renderer.setAttribute(this.canvas, 'height', this.platform.height() * this.pixelRatio + '');

        this.painter = new Painter(this.canvas);

        let rows = this.painter.clipByMeasure(this.bookData);

        this.page = new Page(rows);
        this.pageController = new PageController(this.page, this.painter, this.alertCtrl);

        var _this = this; // Wait for 3rd font loading...
        setTimeout(function() { _this.pageController.draw(); }, 10);
    }

    isSelectionMode() {
        return this.pageController.isSelectionMode();
    }

    setSelectionMode(selectionMode = true) {

        if (selectionMode) {
            this.pageController.enterSelectionMode();
        }
        else {
            this.pageController.leaveSelectionMode();
        }
    }

    clearSelection() {
        this.pageController.clearSelection(true);
    }

    onTouchStart(event: TouchEvent) {
        this.pageController.onTouchStart(this.toCanvasCoordinate(event));
    }

    onTouchMove(event: TouchEvent) {
        this.pageController.onTouchMove(this.toCanvasCoordinate(event));
    }

    onTouchEnd(event: TouchEvent) {
        this.pageController.onTouchEnd(this.toCanvasCoordinate(event));
    }


    /** Converts the touch coordinate to canvas coordinates */
    private toCanvasCoordinate(event: TouchEvent): Point {

        let touchX = event.changedTouches[0].clientX;
        let touchY = event.changedTouches[0].clientY;

        return new Point(touchX * this.pixelRatio, touchY * this.pixelRatio);
    }
}
