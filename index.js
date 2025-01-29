import { getRandomPage } from './wikipedia.js'
import { Text } from './text.js'

/* global $prelude, $articleTitle, $word, $score, $en, $fr, $es */

let right = 0
let wrong = 0

function updateScore () {
  $score.innerText = `${Math.round(100 * right / (right + wrong))}`
}

async function game (lang) {
  const { title, text } = await getRandomPage(lang)
  $articleTitle.innerText = title
  $word.style.display = 'inline'
  $prelude.innerText = text
  const textObj = new Text(text)
  let theWord

  function advance () {
    const { done, value } = textObj.next()
    if (done) {
      const { text } = value
      $word.style.display = 'none'
      $prelude.innerText = text
      return
    }
    const { prelude, word } = value
    theWord = word
    $prelude.innerText = prelude
    $word.style.width = `${word.length * 1.2}em`
    $word.placeholder = `(${word.length})` // word.replace(/./g, ' -')
    updateScore()
  }
  advance()

  $word.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== 'Tab' && event.key !== ' ') {
      return
    }
    event.preventDefault()

    $word.value = $word.value.toLowerCase()
    if ($word.value === theWord) {
      ++right
    } else {
      ++wrong
    }
    $word.value = ''
    advance()
  })
}

$en.addEventListener('click', _ => { game('en') })
$fr.addEventListener('click', _ => { game('fr') })
$es.addEventListener('click', _ => { game('es') })
