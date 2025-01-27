import { getRandomPage } from "./wikipedia.js";

/* Global $prelude $articleTitle */

(async () => {
    const {title, text} = await getRandomPage('en');
    $articleTitle.innerText = title;
    $prelude.innerText = text;
})()

