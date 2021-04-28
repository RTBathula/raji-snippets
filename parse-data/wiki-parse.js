const axios = require('axios');

const regCount = (topic, content) => { 
  const re = new RegExp(topic, 'g');
  return (content.match(re) || []).length;
};

module.exports.getTopicCount = (topic) => {
	const URL = `https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=${topic}`;

	return new Promise((resolve, reject) => {
		axios.get(URL)
		.then((resp) => {
			if (!resp || !resp.data || !resp.data.parse.text) {
				return reject('Couldn\'t find the topic');
			}				  

			const count = regCount(topic, JSON.stringify(resp.data.parse.text));

  			resolve(count);
		}).catch((err) =>  {		    
		    reject(err);
		});
	});
};

