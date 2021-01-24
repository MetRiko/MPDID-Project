const { parse: parseCsv } = require('json2csv')
const fs = require('fs')

const saveAsJson = (filepath, json) => {
	const string = JSON.stringify(json, null, '  ')
	fs.writeFileSync(filepath, string)
}

const saveAsCsv = (filepath, json) => {
	const string = parseCsv(json).replaceAll(',', ';').replaceAll('.', ',') 
	fs.writeFileSync(filepath, string)
}

module.exports = {
	saveAsJson,
	saveAsCsv
}