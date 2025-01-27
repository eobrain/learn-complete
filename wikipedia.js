const params = {
  action: 'query',
  format: 'json',
  list: 'random',
  rnnamespace: 0,
  rnlimit: 2
}

const randomUrl = lang => `https://${lang}.wikipedia.org/w/api.php?origin=*&` +
    Object.keys(params).map((key) => key + '=' + params[key]).join('&')

export async function getRandomPage (lang) {
  const randomJson = await (await fetch(randomUrl(lang))).json()
  const title = randomJson.query.random[0].title
  const titleUnderscored = title.replace(/ /g, '_')

  const textUrl = `https://${lang}.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&titles=${titleUnderscored}&formatversion=2&exsentences=10&exlimit=1&exintro=1&explaintext=1&exsectionformat=plain`
  const textJson = await (await fetch(textUrl)).json()
  const text = textJson.query.pages[0].extract
  return { title, text }
}
