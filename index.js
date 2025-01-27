import { getRandomPage } from './wikipedia.js'
import { Text } from './text.js'

/* global $prelude, $articleTitle, $word, $score */

let right = 0
let wrong = 0

function updateScore () {
  $score.innerText = `${Math.round(100 * right / (right + wrong))}`
}

(async () => {
  const { title, text } = await getRandomPage('fr')
  $articleTitle.innerText = title
  const textObj = new Text(text)
  let theWord

  function advance () {
    const { done, value } = textObj.next()
    if (done) {
      return
    }
    const { prelude, word } = value
    theWord = word
    $prelude.innerText = prelude
    $word.style.width = `${word.length * 0.7}em`
    $word.placeholder = word.replace(/./g, ' -')
    updateScore()
  }
  advance()

  $word.addEventListener('input', () => {
    $word.value = $word.value.toLowerCase()
    if ($word.value.length >= theWord.length) {
      if ($word.value === theWord) {
        ++right
      } else {
        ++wrong
      }
      $word.value = ''
      advance()
    } else if (!theWord.startsWith($word.value)) {
      ++wrong
      $word.value = ''
      advance()
    }
  })
})()
