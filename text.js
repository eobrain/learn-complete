export class Text {
  constructor (text) {
    this.iterator = text.matchAll(/(?<!\p{Letter})([\p{Lowercase_Letter}'-]+)(?!\p{Letter})/gu)
    this.text = text
  }

  next () {
    const { done, value } = this.iterator.next()
    if (done) {
      const text = this.text
      return { done, value: { text } }
    }
    const { index } = value
    const word = value[0]
    const prelude = this.text.substring(0, index)
    return { done, value: { word, prelude } }
  }
}
