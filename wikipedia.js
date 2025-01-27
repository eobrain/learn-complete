const params = {
    action: "query",
    format: "json",
    list: "random",
    rnnamespace: 0,
    rnlimit: 2
};


function deWikify(text) {
    return text;
    //return text.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    //    const parts = p1.split("|");
    //    return parts[parts.length - 1];
    //}
}
const randomUrl = lang => `https://${lang}.wikipedia.org/w/api.php?origin=*&` +
    Object.keys(params).map((key) => key + "=" + params[key]).join("&");


export async function getRandomPage(lang) {
    const randomJson = await (await fetch(randomUrl(lang))).json();
    const title = randomJson.query.random[0].title.replace(/ /g, "_");

    //const textUrl = `https://${lang}.wikipedia.org/w/index.php?origin=*&title=${title}&action=raw`

    const textUrl = `https://${lang}.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&titles=${title}&formatversion=2&exsentences=10&exlimit=1&exintro=1&explaintext=1&exsectionformat=plain`
    console.log(textUrl)
    //const text = await (await fetch(textUrl)).text();
    //return deWikify(text);
    const textJson = await (await fetch(textUrl)).json();
    return textJson.query.pages[0].extract;
}