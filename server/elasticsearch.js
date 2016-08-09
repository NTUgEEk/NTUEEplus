const ElasticSearch = require('elasticsearch');
const client = new ElasticSearch.Client({
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

// client.search({
//   index: 'bank',
//   type: 'account',
//   body: {
//     query: {
//       match: {
//         gender: 'M',
//       },
//     },
//   },
// }).then((resp) => {
//   console.log('hit', resp.hits.hits);
// }, (err) => {
//   console.trace(err.message);
// });

const parseData = (data) => {
  const people = [];
  for (let i = 0, length = data.length; i < length; ++i) {
    const theData = data[i];
    const person = {
      school_id: theData[0],
      name: theData[1],
      facebook: theData[2],
      linkedin: theData[3],
      line_id: theData[4],
      wechat_id: theData[5],
      // ???: theData[6],
      email: theData[7],
      mobile: theData[8],
      office_phone: theData[9],
      city: theData[10],
      company: theData[11],
      prev_company: theData[12],
      work_field: theData[13],
      skype: theData[14],
      // last_update: theData[15],
      others: theData[16],
    };
    people.push(person);
  }
  return people;
};

exports.setupDatabase = (data) => {
  const people = parseData(data);
  const body = [];
  for (let i = 0, length = people.length; i < length; ++i) {
    body.push({
      index: {
        _index: 'ntuee',
        _type: 'user',
        _id: i + 1,
      },
    });
    body.push(people[i]);
  }
  client.bulk({
    body, // body: body
  }).then((resp) => {
    console.log('resp in setup', resp);
  }).catch((err) => {
    console.log('err in setup', err);
  });
};

exports.search = () => {

};
