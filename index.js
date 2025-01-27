import { getRandomPage } from "./wikipedia.js";
import { Text } from "./text.js";

/* Global $prelude $articleTitle $word */


(async () => {
    const { title, text } = await getRandomPage('en');
    $articleTitle.innerText = title;
    const textObj = new Text(text);
    let theWord = undefined

    function advance() {
        const { done, value } = textObj.next();
        if (done) {
            return;
        }
        const { prelude, word } = value
        theWord = word
        $prelude.innerText = prelude;
        $word.style.width = `${word.length * 0.7}em`;
    }
    advance()

    $word.addEventListener('input', () => {
        $word.value = $word.value.toLowerCase();
        if ($word.value.length >= theWord.length) {
            if ($word.value === theWord) {
                console.log('Correct!');
            } else {
                console.log('Wrong!');
            }
            $word.value = '';
            advance();
        } else if (!theWord.startsWith($word.value)) {
            console.log('Wrong!');
            $word.value = '';
            advance();
        }
    })
})()

