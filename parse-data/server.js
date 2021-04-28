var express = require('express');
var app = express();
const fs = require('fs');
const wiki = require('./wiki-parse');

const isFiniteNumber = value => typeof value === 'number' && !isNaN(value) && isFinite(value);

const sort = (valueA, valueB) => {
	return isFiniteNumber(valueA) ? (valueA - valueB) : valueA.trim().localeCompare(valueB.trim());	
};

// E.g: /products?skip=0&limit=30&sort=first_name:desc
app.get('/products', (req, res) => {	
	let [sortColumn, sortOrder] = (req.query.sort || '').split(':');
	sortColumn = sortColumn || 'first_name';
	sortOrder = sortOrder || 'asc';

	const skip = parseInt(req.query.skip || 0);
	const limit = parseInt(req.query.limit || 20);


	fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
		const list = JSON.parse(data);
		
		const slicePosition = (skip + limit);
		const finalList = list.slice(skip, slicePosition).sort((a, b) => {
			const valueA = a[sortColumn];
			const valueB = b[sortColumn];
			return sortOrder === 'asc' ? sort(valueA, valueB) : sort(valueB, valueA);					
		});

	  	return res.status(200).send(finalList);
	});
});

// E.g /cars/year?valid_from=1980
app.get('/cars/year', (req, res) => {
	const validFrom = parseInt(req.query.valid_from || 1991);

	fs.readFile('./MOCK_DATA_CAR.json', 'utf8', (err, data) => {
		const list = JSON.parse(data);		
	
		const finalList = list.filter((obj) => (obj.car_model_year > validFrom));
	  	return res.status(200).send(finalList);
	});
});

wiki.getTopicCount('philosophy').then((count) => {
	console.log(count);
}).catch((err) => {
	console.log(err);
});

const PORT = 8081;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
