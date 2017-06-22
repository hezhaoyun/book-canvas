import { Component, ViewChild, Input, ElementRef, Renderer2 } from '@angular/core';
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
    @Input() page: Page;

    canvas: any;
    painter: Painter;
    pageController: PageController;

    private pixelRatio = 1;

    constructor(
        public platform: Platform,
        public renderer: Renderer2,
        private bookData: BookDataProvider,
        public alertCtrl: AlertController) {
        
    }

    ngAfterViewInit() {

        this.canvas = this.canvasElement.nativeElement;

        this.pixelRatio = PaintConfig.pixelRatio(this.canvas);
        this.renderer.setAttribute(this.canvas, 'width', this.platform.width() * this.pixelRatio + '');
        this.renderer.setAttribute(this.canvas, 'height', this.platform.height() * this.pixelRatio + '');

        this.painter = new Painter(this.canvas);
        this.pageController = new PageController(this.page, this.painter, this.alertCtrl);
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
