import { getRandomPage } from './wikipedia.js'
import { Text } from './text.js'

/* global ons, $prelude, $articleTitle, $word, $percentSlider, $percentText, $lang, $scroll, $restart */

let right = 0
let wrong = 0

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

function updateScore () {
  if (right + wrong === 0) {
    $percentSlider.visibility = 'hidden'
    $percentText.innerText = ''
    return 100
  }
  const percent = Math.round(100 * right / (right + wrong))
  $percentSlider.value = percent
  $percentText.innerText = percent
  return percent
}

const instructions = {
  en: { title: 'Instructions', message: 'You will see the beginning of a random Wikipedia article. Type the word that comes next and press space.' },
  fr: { title: 'Instructions', message: 'Vous verrez le début d\'un article Wikipédia aléatoire. Tapez le mot qui vient après et appuyez sur la barre d\'espace.' },
  es: { title: 'Instrucciones', message: 'Verás el comienzo de un artículo aleatorio de Wikipedia. Escribe la palabra que viene a continuación y pulsa la barra espaciadora.' }
}
const loseMessage = {
  en: { title: 'You lost!', message: 'Game over, because you guessed less than 50% correct.' },
  fr: { title: 'Vous avez perdu!', message: 'Fin du jeu, car vous avez deviné moins de 50% de bonnes réponses.' },
  es: { title: '¡Perdiste!', message: 'Juego terminado, porque adivinaste menos del 50% correcto.' }
}
const winMessage = {
  en: { title: 'You won!', message: 'Game over, because you got to the end with 50% or more answers correc,t' },
  fr: { title: 'Vous avez gagné!', message: 'Fin du jeu, car vous êtes arrivé à la fin avec 50% ou plus de bonnes réponses.' },
  es: { title: '¡Ganaste!', message: 'Juego terminado, porque llegaste al final con 50% o más de respuestas correctas.' }
}

const instructionsShown = { en: false, fr: false, es: false }

async function game (lang) {
  right = wrong = 0
  $restart.style.visibility = 'hidden'
  $scroll.innerHTML = ''
  const { title, text } = await getRandomPage(lang)
  $articleTitle.innerText = title
  $word.style.display = 'inline'
  $word.focus()
  $prelude.innerText = text
  const textObj = new Text(text)
  let theWord

  async function advance () {
    const { done, value } = textObj.next()
    if (done) {
      const { text } = value
      $word.style.display = 'none'
      $prelude.innerText = text
      $restart.style.visibility = 'visible'
      await ons.notification.alert(winMessage[lang])
      return
    }
    const { prelude, word } = value
    theWord = word
    $prelude.innerText = prelude
    $word.style.width = `${word.length * 1.2}em`
    $word.placeholder = `(${word.length})`
    if (updateScore() < 50) {
      await ons.notification.alert(loseMessage[lang])
      $restart.style.visibility = 'visible'
      game($lang.value)
    }
  }
  await advance()

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
          <div class="list-item__title">❌ <span class="wrong">${$word.value}</span></div>
          <div class="list-item__subtitle">${theWord}</div>
        </ons-list-item>
        `)
    }
    $word.value = ''
    await advance()
  }

  if (!instructionsShown[lang]) {
    await ons.notification.alert(instructions[lang])
    instructionsShown[lang] = true
  }
  $word.focus()
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

$restart.onclick = () => { game($lang.value) }
