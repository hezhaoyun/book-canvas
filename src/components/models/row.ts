import {Word} from "./word";
/**
 * Created by hezhaoyun on 2017/6/16.
 */

export class Row {

  private line = '';
  private words: Word[] = [];

  constructor(public y: number = 0, public height: number = 0) {
  }

  asLine() {
    return this.line;
  }

  length() {
    return this.words.length;
  }

  wordAt(index: number) {
    return this.words[index];
  }

  map(action: (word: Word) => void) {

    for (let word of this.words) {
      action(word);
    }
  }

  pushWord(word: Word) {
    this.words.push(word);
    this.line += word.word;
  }

  popWord(): Word {
    let word = this.words.pop();
    this.line = this.line.substring(0, this.line.length - 1);
    return word;
  }

  isEmpty() {
    return this.words.length == 0;
  }

  firstWordX() {
    return this.words[0].x;
  }
}
