const fs = require('fs');
const { saveAsJson, saveAsCsv } = require('./filesystem');
const { search } = require('./scrapper');
const { sleep } = require('./utils');

const scrapData = async (group, languages, execution = async (lang) => {}) => {

	console.log(`\nProcessing group... ${group}`)

	const items = []
	let idx = 0
	for (const lang of languages) {
		++idx
		console.log(`Processing langauge... ${idx}/${languages.length}`)
		await sleep(4000)
		const langItems = await execution(lang)
		items.push(langItems)
	}

	const flattedItems = items.flat()
	flattedItems.forEach(item => Object.assign(item, {group}))

	return flattedItems
} 

const scrapAll = async () => {
	// const reposByRecentlyUpdated = [
	// 	await scrapData('Android languages', ['dart', 'javascript', 'kotlin', 'csharp'], 
	// 		async lang => await search().withTopic('android').withLangauge(lang).sortByRecentlyUpdated().pages(10).perPage(100).execute()
	// 	),
	// 	await scrapData('JavaScript UI frameworks', ['react', 'vue', 'angular', 'polymer', 'preact', 'ember'], 
	// 		async topic => await search().withTopic(topic).sortByRecentlyUpdated().pages(10).perPage(100).execute()
	// 	),
	// 	await scrapData('Low level languages', ['c', 'cpp', 'rust', 'go'], 
	// 		async lang => await search().withLangauge(lang).sortByRecentlyUpdated().pages(10).perPage(100).execute()
	// 	)
	// ].flat()

	// saveAsJson(`data/reposByRecentlyUpdated.json`, reposByRecentlyUpdated)
	// saveAsCsv(`data/reposByRecentlyUpdated.csv`, reposByRecentlyUpdated)

	const reposByStars = [
		await scrapData('Android languages', ['dart', 'javascript', 'kotlin', 'csharp'], 
			async lang => await search().withTopic('android').withLangauge(lang).sortByStars().pages(10).perPage(100).execute()
		),
		await scrapData('JavaScript UI frameworks', ['react', 'vue', 'angular', 'polymer', 'preact', 'ember'], 
			async topic => await search().withTopic(topic).sortByStars().pages(10).perPage(100).execute()
		),
		await scrapData('Low level languages', ['c', 'cpp', 'rust', 'go'], 
			async lang => await search().withLangauge(lang).sortByStars().pages(10).perPage(100).execute()
		)
	].flat()

	saveAsJson(`data/reposByStars.json`, reposByStars)
	saveAsCsv(`data/reposByStars.csv`, reposByStars)

	// const reposByBestMatch = [
	// 	await scrapData('Android languages', ['dart', 'javascript', 'kotlin', 'csharp'], 
	// 		async lang => await search().withTopic('android').withLangauge(lang).sortByBestMatch().pages(10).perPage(100).execute()
	// 	),
	// 	await scrapData('JavaScript UI frameworks', ['react', 'vue', 'angular', 'polymer', 'preact', 'ember'], 
	// 		async topic => await search().withTopic(topic).withLangauge('javascript').sortByBestMatch().pages(10).perPage(100).execute()
	// 	),
	// 	await scrapData('Low level langauges', ['c', 'cpp', 'rust', 'go'], 
	// 		async lang => await search().withLangauge(lang).sortByBestMatch().pages(10).perPage(100).execute()
	// 	)
	// ].flat()

	// saveAsJson(`data/reposByBestMatch.json`, reposByBestMatch)
	// saveAsCsv(`data/reposByBestMatch.csv`, reposByBestMatch)
}

scrapAll()

// (async () => {
// 	const data = fs.readFileSync('data/reposByRecentlyUpdated')
// })