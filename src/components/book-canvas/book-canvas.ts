import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Platform } from 'ionic-angular';
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

    constructor(public platform: Platform, public renderer: Renderer2, private bookData: BookDataProvider) {
    }

    ngAfterViewInit() {

        this.canvas = this.canvasElement.nativeElement;

        let pixelRatio = PaintConfig.pixelRatio(this.canvas);

        this.renderer.setAttribute(this.canvas, 'width', this.platform.width() * pixelRatio + '');
        this.renderer.setAttribute(this.canvas, 'height', this.platform.height() * pixelRatio + '');

        this.painter = new Painter(this.canvas);

        let rows = this.painter.clipByMeasure(
            this.bookData.longText,
            this.bookData.startIndex
        );

        this.page = new Page(rows);
        this.pageController = new PageController(this.page, this.painter);

        this.pageController.draw();
    }

    switchSelectionMode() {

        if (this.pageController.isSelectionMode()) {
            this.pageController.leaveSelectionMode();
        }
        else {
            this.pageController.enterSelectionMode();
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

        return new Point(touchX, touchY);
    }
}
