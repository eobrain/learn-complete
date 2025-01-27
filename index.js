import { getRandomPage } from "./wikipedia.js";

/* Global $prelude */

(async () => {
    $prelude.innerText = await getRandomPage('en');
})()

