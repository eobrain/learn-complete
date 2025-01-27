import { getRandomPage } from "./wikipedia.js";
import { Text } from "./text.js";

/* Global $prelude $articleTitle $word */

(async () => {
    const { title, text } = await getRandomPage('en');
    $articleTitle.innerText = title;
    const textObj = new Text(text);
    const { done, value } = textObj.next();
    if (done) {
        return;
    }
    const { prelude, word } = value
    $prelude.innerText = prelude;
    $word.value = word;
    $word.style.width = `${word.length * 0.7}em`;
})()

