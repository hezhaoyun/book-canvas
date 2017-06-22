import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
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

    pages: Page[] = [new Page()]; // 为了文本分布，需要先有一个canvas，使用空白的Page获取这个canvas

    @ViewChild('slides') slides: Slides;
    @ViewChildren(BookCanvasComponent) canvasComponents: QueryList<BookCanvasComponent>;

    constructor(public navCtrl: NavController, private bookData: BookDataProvider) {
    }

    ionViewDidEnter() {

        let activeIndex = this.slides.getActiveIndex();
        let activeComponent: BookCanvasComponent = this.canvasComponents.toArray()[activeIndex];

        let paintConfig = PaintConfig.shared(activeComponent.canvas);

        this.pages = paintConfig.pagingByMeasure(
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
