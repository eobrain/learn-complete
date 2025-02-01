import { getRandomPage } from './wikipedia.js'
import { Text } from './text.js'

/* global $prelude, $articleTitle, $word, $score, $lang */

let right = 0
let wrong = 0

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

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

  $word.addEventListener('input', async event => {
    if (event.data !== ' ') {
      console.log(event)
      // Keep accepting charactes
      return
    }

    await sleep(1)

    event.preventDefault()

    // Go to next word
    $word.value = $word.value.trim().toLowerCase()
    if ($word.value === theWord) {
      ++right
    } else {
      ++wrong
    }
    $word.value = ''
    advance()
  })
}

const browserLang = navigator.language.substring(0, 2)
for (const $option of $lang.children) {
  if ($option.value === browserLang) {
    $option.selected = true
    break
  }
}

$lang.addEventListener('change', event => { game($lang.value) })
game($lang.value)
