const express = require ('express')
const axios = require ('axios')
const cheerio = require ('cheerio')
const csvtojson = require("csvtojson")
const cors = require('cors')

const app = express()
app.use(cors())

const DATE = 0, OPEN = 1, HIGH = 2, LOW = 3, CLOSE = 4
const symbols = ["AUD-CAD","AUD-CHF","AUD-JPY","AUD-NZD","AUD-USD","CAD-CHF","CAD-JPY","CHF-JPY","EUR-AUD","EUR-CHF","EUR-CAD","EUR-GBP","EUR-JPY","EUR-NZD","EUR-USD","GBP-AUD","GBP-CAD","GBP-CHF","GBP-JPY","GBP-NZD","GBP-USD","NZD-CAD","NZD-CHF","NZD-JPY","NZD-USD","USD-CAD","USD-CHF","USD-JPY"]

//const URL = 'https://query1.finance.yahoo.com/v7/finance/download/{0}=X?period1=1638569116&period2=1670105116&interval=1d'
const URL2 = 'https://www.investing.com/currencies/{0}-historical-data'

function format(source, params) {
	params.forEach(function (n, i) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	})
	return source;
}

app.get('/symbols', (req, res) => {
	res.json({
		symbols: symbols
	})
})

app.get('/history/:symbol/get', (req, res) => {

	const url = format(URL2, [req.params.symbol.toLowerCase()])

	axios.get(url, {
		headers: {
			'Accept-Encoding': 'application/html',
		}
	})
		.then((resPage) => {

			const html = resPage.data
			const $ = cheerio.load(html)
			var list = []

			$('table[data-test="historical-data-table"] tbody tr').each ((i, e) => {
				console.log(i)
				const $$ = cheerio.load(e)
				const tdList = $$('td').map((i, e) => e)

				list.push({
					Date: cheerio.load(tdList[0]).text(),
					Close: cheerio.load(tdList[1]).text(),
					Open: cheerio.load(tdList[2]).text(),
					High: cheerio.load(tdList[3]).text(),
					Low: cheerio.load(tdList[4]).text()
				})
			})
			res.json(list)
		})
})
/*
app.get('/history/:symbol/get_old', (req, res) => {


	const url = format(URL, [req.params.symbol])
	const list = []

	axios.get(url, {
		headers: {
			'Accept-Encoding': 'application/json',
		}
	})
	.then((resPage) => {
		const a = csvtojson()
		a.fromString(resPage.data)
			.then(function(jsonArrayObj){
			res.json(jsonArrayObj)
		})
	})

	/*
	symbolList.forEach((url, i) => {

	})

	axios.get('https://finance.yahoo.com/quote/EURUSD%3DX/history', {
                headers: {
                    'Accept-Encoding': 'application/json',
                }
            })
		.then((resPage) => {
			 
			const html = resPage.data
			const $ = cheerio.load(html)
			var list = []

			res.send(html)

			/*
			$('table > tbody > tr > td').each ((i, e) => {
				list.push(cheerio.load(e).text())
			})

			$('a[download="EURUSD=X.csv"]').first()
			res.json($('a[download="EURUSD=X.csv"]').first())
			 
			//console.log(resPage)
			//res.json('A')

		})
	*/
//})

app.listen(8000)