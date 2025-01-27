export class Text {

    constructor(text) {
        this.iterator = text.matchAll(/\b([a-z]+)\b/g)
        this.text = text;

    }

    next() {
        const { done, value } = this.iterator.next();
        if (done) {
            return { done }
        }
        const { index } = value;
        const word = value[0]
        const prelude = this.text.substring(0, index);
        return { done, value: { word, prelude } }
    }

}