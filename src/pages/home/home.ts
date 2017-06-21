import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { NavController, Slides } from "ionic-angular";
import { BookCanvasComponent } from "../../components/book-canvas/book-canvas";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('slides') slides: Slides;
    @ViewChildren(BookCanvasComponent) canvasComponents: QueryList<BookCanvasComponent>;

    constructor(public navCtrl: NavController) {
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
