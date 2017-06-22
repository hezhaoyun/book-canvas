import { PaintConfig, ContextFor } from "./paint-config";
import { Page } from "../models/page";
import { Row } from "../models/row";
import { Word } from "../models/word";
import { BookDataProvider } from '../../providers/book-data/book-data';

export const REMARK_FLAG = '\ue643';

export class Painter {

    constructor(private canvas: any) {
    }

    draw(page: Page) {

        let pageRect = PaintConfig.shared().PageRect;

        let context = PaintConfig.shared().prepareContext(ContextFor.REUSE);
        context.clearRect(0, 0, pageRect.width, pageRect.height);

        if (page.isSelectionMode()) {

            let context = PaintConfig.shared().prepareContext(ContextFor.DRAW_SELECTION_BG);

            page.map(row => {
                let rect = row.selectionRect();
                context.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
        }

        page.map(row => {

            row.map(word => {

                let rect = word.rect();

                if (word.isRemarkFlag()) {

                    let context = PaintConfig.shared().prepareContext(ContextFor.DRAW_REMARK_FLAG_BG);
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);

                    context = PaintConfig.shared().prepareContext(ContextFor.DRAW_REMARK_FLAG_TEXT);
                    context.fillText(word.word, rect.x, rect.y);
                }
                else {

                    let context = PaintConfig.shared().prepareContext(
                        page.isSelectionMode() ? ContextFor.DRAW_SELECTION_TEXT : ContextFor.DRAW_TEXT
                    );

                    context.fillText(word.word, rect.x, rect.y);
                }
            });
        });
    }
}
