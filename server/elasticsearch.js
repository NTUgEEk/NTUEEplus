// api: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search

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

exports.getUserById = (id, next) => {
  client.search({
    index: 'ntuee',
    type: 'user',
    id, // id: id,
  }).then((resp) => {
    console.log('resp', resp);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};

exports.getUserBySchool_Id = (schoolId, next) => {
  client.search({
    index: 'ntuee',
    type: 'user',
    body: {
      query: {
        match: {
          school_id: schoolId,
        },
      },
    },
  }).then((resp) => {
    console.log('hit', resp.hits.hits);
    next(resp.hits.hits);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};

exports.updateUserById = (id, doc, next) => {
  client.update({
    index: 'ntuee',
    type: 'user',
    id, // id: id,
    body: {
      doc, // doc, doc
    },
  }).then((resp) => {
    next(resp);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};

exports.search = (strings, next) => {
  let myQuery = '';
  if (strings.length !== 0) {
    myQuery = `\'${strings[0]}\'`;
  }
  for (let i = 1; i < strings.length; ++i) {
    myQuery = `${myQuery} OR \'${strings[i]}\'`;
  }

  client.search({
    index: 'ntuee',
    type: 'user',
    body: {
      query: {
        query_string: {
          // fields: ['name', 'email'],
          query: myQuery,
        },
      },
    },
  }).then((resp) => {
    console.log('hit', resp.hits.hits);
    next(resp.hits.hits);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};
