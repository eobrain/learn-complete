import { getRandomPage } from "./wikipedia.js";

/* Global $prelude $articleTitle $word */

(async () => {
    const { title, text } = await getRandomPage('en');
    $articleTitle.innerText = title;
    $prelude.innerText = text;
    $word.style.width = '5em';
})()

