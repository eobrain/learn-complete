const params = {
    action: "query",
    format: "json",
    list: "random",
    rnnamespace: 0,
    rnlimit: 2
};

const url = lang => `https://${lang}.wikipedia.org/w/api.php?origin=*&` +
    Object.keys(params).map((key) => key + "=" + params[key]).join("&");

    export async function getRandomPage(lang) {
    const response = await fetch(url(lang));
    const json = await response.json();
    const meta = json.query.random[0];
    return JSON.stringify(meta);
}