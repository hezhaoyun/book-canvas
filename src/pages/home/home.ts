import {Component, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {BookCanvasComponent} from "../../components/book-canvas/book-canvas";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('canvasComponent') canvasComponent: BookCanvasComponent;

  constructor(public navCtrl: NavController) {
  }

  switchSelectionMode() {
    this.canvasComponent.switchSelectionMode();
  }

  clearSelection() {
    this.canvasComponent.clearSelection();
  }
}
