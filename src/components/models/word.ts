/**
 * Created by hezhaoyun on 2017/6/16.
 */

export class Word {

  private selected = false;

  constructor(public readonly word: string, public readonly x: number, public readonly width: number) {
  }

  isSelected() {
    return this.selected;
  }

  setSelected(selected = true) {
    this.selected = selected;
  }
}
