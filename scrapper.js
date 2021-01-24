const { default: axios } = require("axios")
const { saveAsJson } = require("./filesystem")
const { sleep } = require('./utils')

const apiUrl = 'https://api.github.com'

const searchUrl = '/search/repositories' 

const search = () => new SearchBuilder()

const execute = async (searchBuilder) => {
	
	const {_pagesAmount, _perPage, _sortBy, _order, _queryParams} = searchBuilder

	const searchQuery = _queryParams.map(({type, value}) => {
		switch (type) {
			case 'topic': 
				return `topic:${value}`
			case 'language': 
				return `language:${value}` 
			case 'createdBefore': 
				return `created:<${value}` 
			case 'createdAfter': 
				return `created:>${value}` 
		}
	}).join(' ')

	const url = `${apiUrl}${searchUrl}`

	const sendRequest = async page => {
		const params = {
			page: page,
			per_page: _perPage,
			sort: _sortBy,
			q: searchQuery
		}		
		if (_order !== null) params.order = _order

		const headers = { 'User-Agent': 'request' }

		// console.log(params)
		let resp = null
		return await axios(url, {params, headers})
			.then(response => response.data)
			.then(data => {
				resp = data
				return data.items
			})
			.catch(error => {
				console.error("AXIOS ERROR")
				error.resp = resp
				saveAsJson('error.log.json', error)
			})
	} 
	
	// const promises = [...Array(_pagesAmount).keys()].map(async idx => sendRequest(idx + 1))
	
	// console.log(`Processing request with parameters: ${[_pagesAmount, _perPage, _sortBy, _order, _queryParams]}`)

	const items = []
	for (let page = 1; page <= _pagesAmount; ++page) {
		console.log(`Processing page... ${page}/${_pagesAmount}`)
		await sleep(4000)
		const pageItems = await sendRequest(page).then(items => items.map(filterItem))
		items.push(pageItems)
	}

	return items.flat()

	// return await Promise.all(promises).then(items => items.flat().map(filterItem))
}

const filterItem = (item) => Object.entries(item).reduce((obj, [key, value]) => {
		if (value instanceof Object) {
			// obj[key] = filterItem(value)
		}
		else if (!/.*url.*/.test(key)) obj[key] = value
		return obj
	}, {})

class SearchBuilder {

	_queryParams = [] 
	_pagesAmount = 1
	_perPage = 100
	_sortBy = 'best match'
	_order = null

	_addParam(type, value) {
		this._queryParams.push({type, value})
	}

	withTopic(topic) {
		this._addParam('topic', topic)
		return this
	}
	
	withLangauge(language) {
		this._addParam('language', language)
		return this
	}

	createdBefore(dateYMD) {
		this._addParam('createdBefore', dateYMD)
		return this
	}

	createdAfter(dateYMD) {
		this._addParam('createdAfter', dateYMD)
		return this
	}

	sortByBestMatch() {
		this._sortBy = 'best match'
		return this
	}

	sortByRecentlyUpdated() {
		this._sortBy = 'updated'
		return this
	}

	sortByStars() {
		this._sortBy = 'stars'
		return this
	}

	sortByForks() {
		this._sortBy = 'forks'
		return this
	}

	orderAsc() {
		this._order = 'asc'
		return this
	}

	orderDesc() {
		this._order = 'dsc'
		return this
	}

	pages(_pagesAmount) {
		this._pagesAmount = _pagesAmount
		return this
	}

	perPage(_perPage) {
		this._perPage = _perPage
		return this
	}

	async execute() {
		return await execute(this)
	}
}

module.exports = {
	search
}