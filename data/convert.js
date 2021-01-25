
const fs = require('fs')
const { parse } = require('json2csv');
const { saveAsJson, saveAsCsv } = require('../filesystem');



const removeDuplicates = (json) => {
	const noDuplicates = {}
	
	json.forEach(repo => {
		
		if (noDuplicates[repo.id]) {
			const obj = noDuplicates[repo.id]
			obj.topic = `${obj.topic} ${repo.topic}`
		}
		else {
			noDuplicates[repo.id] = repo
		}
	
	});
	return Object.values(noDuplicates)
} 

const reposByRecentlyUpdated = removeDuplicates(JSON.parse(fs.readFileSync('data/reposByRecentlyUpdated.json')))
const reposByStars = removeDuplicates(JSON.parse(fs.readFileSync('data/reposByStars.json')))

saveAsJson('data/reposByRencetlyUpdatedWD.json', reposByRecentlyUpdated)
saveAsCsv('data/reposByRencetlyUpdatedWD.csv', reposByRecentlyUpdated)

saveAsJson('data/reposByStarsWD.json', reposByStars)
saveAsCsv('data/reposByStarsWD.csv', reposByStars)