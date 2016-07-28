const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

client.ping({
  requestTimeout: 30000,

  // undocumented params are appended to the query string
  hello: 'elasticsearch',
}, (error) => {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

client.search({
  index: 'bank',
  type: 'account',
  body: {
    query: {
      match: {
        gender: 'M',
      },
    },
  },
}).then((resp) => {
  console.log('hit', resp.hits.hits);
}, (err) => {
  console.trace(err.message);
});
