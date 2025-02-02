import { getRandomPage } from './wikipedia.js'
import { Text } from './text.js'

/* global ons, $prelude, $articleTitle, $word, $score, $lang, $scroll */

let right = 0
let wrong = 0

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

function updateScore() {
  $score.innerText = `${Math.round(100 * right / (right + wrong))}`
}

async function game(lang) {
  const { title, text } = await getRandomPage(lang)
  $articleTitle.innerText = title
  $word.style.display = 'inline'
  $prelude.innerText = text
  const textObj = new Text(text)
  let theWord

  function advance() {
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

  $word.oninput = async event => {
    if (event.data !== ' ') {
      // Keep accepting characters
      return
    }

    await sleep(1)

    event.preventDefault()

    // Go to next word
    $word.value = $word.value.trim().toLowerCase()

    if ($word.value === theWord) {
      ++right
      $scroll.insertAdjacentHTML('afterbegin', `
        <ons-list-item>
          <div class="list-item__title">✅ ${$word.value}</div>
        </ons-list-item>
        `)
    } else {
      ++wrong
      $scroll.insertAdjacentHTML('afterbegin', `
        <ons-list-item>
          <div class="list-item__title wrong">❌ ${$word.value}</div>
          <div class="list-item__subtitle">${theWord}</div>
        </ons-list-item>
        `)
    }
    $word.value = ''
    advance()
  }
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
