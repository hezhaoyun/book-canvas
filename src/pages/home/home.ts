import { Component, ViewChild, ViewChildren, ElementRef, QueryList } from "@angular/core";
import { NavController, Slides } from "ionic-angular";

import { Page } from "../../components/models/page";
import { PaintConfig } from "../../components/domain/paint-config";
import { BookCanvasComponent } from "../../components/book-canvas/book-canvas";
import { BookDataProvider } from '../../providers/book-data/book-data';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('slides') slides: Slides;
    @ViewChildren(BookCanvasComponent) canvasComponents: QueryList<BookCanvasComponent>;

    pages: Page[] = [];

    constructor(public navCtrl: NavController, private bookData: BookDataProvider) {
        this.pages.push(new Page());
    }

    ionViewDidEnter() {

        let activeIndex = this.slides.getActiveIndex();
        let activeComponent: BookCanvasComponent = this.canvasComponents.toArray()[activeIndex];

        let paintConfig = PaintConfig.shared(activeComponent.canvas);

        this.pages = paintConfig.splitByMeasure(
            activeComponent.canvas.getContext('2d'),
            this.bookData
        );
        
        this.slides.update();
    }

    switchSelectionMode() {
        
        let activeIndex = this.slides.getActiveIndex();
        let activeCanvas: BookCanvasComponent = this.canvasComponents.toArray()[activeIndex];

        if (activeCanvas.isSelectionMode()) {
            activeCanvas.setSelectionMode(false);
            this.slides.lockSwipes(false);
        }
        else {
            activeCanvas.setSelectionMode();
            this.slides.lockSwipes(true);
        }
    }

    clearSelection() {

        let activeIndex = this.slides.getActiveIndex();
        let activeCanvas: BookCanvasComponent = this.canvasComponents.toArray()[activeIndex];

        activeCanvas.clearSelection();
    }

    ionSlideTap() {
        console.log('ionSlideTap');
    }
}
