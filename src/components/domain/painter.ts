import { PaintConfig, ContextFor } from "./paint-config";
import { Page } from "../models/page";

export class Painter {

    private context: any;

    constructor(private canvas: any) {
        this.context = canvas.getContext('2d');
    }

    draw(page: Page) {

        let paintConfig = PaintConfig.shared();
        if (paintConfig == null) return;

        paintConfig.prepareContext(this.context, ContextFor.REUSE);
        
        this.context.clearRect(
            0,
            0,
            PaintConfig.shared().PageRect.width,
            PaintConfig.shared().PageRect.height
        );

        if (page.isSelectionMode()) {

            PaintConfig.shared().prepareContext(this.context, ContextFor.DRAW_SELECTION_BG);

            page.map(row => {
                let rect = row.selectionRect();
                this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
        }

        page.map(row => {

            row.map(word => {

                let rect = word.rect();

                if (word.isRemarkFlag()) {

                    PaintConfig.shared().prepareContext(this.context, ContextFor.DRAW_REMARK_FLAG_BG);
                    this.context.fillRect(rect.x, rect.y, rect.width, rect.height);

                    PaintConfig.shared().prepareContext(this.context, ContextFor.DRAW_REMARK_FLAG_TEXT);
                    this.context.fillText(word.word, rect.x, rect.y);
                }
                else {

                    PaintConfig.shared().prepareContext(
                        this.context,
                        page.isSelectionMode() ? ContextFor.DRAW_SELECTION_TEXT : ContextFor.DRAW_TEXT
                    );

                    this.context.fillText(word.word, rect.x, rect.y);
                }
            });
        });
    }
}
