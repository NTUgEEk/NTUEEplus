// api: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html

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
const columnList = [
  'school_id',    // 0
  'name',
  'facebook',
  'linkedin',
  'line_id',
  'wechat_id',    // 5
  '???',
  'email',
  'mobile',
  'office_phone',
  'city',         // 10
  'company',
  'prev_company',
  'work_field',
  'skype',
  'last_update',  // 15
  'others',
];
const parseData = (data) => {
  const people = [];
  for (let i = 0, length = data.length; i < length; ++i) {
    const theData = data[i];
    const person = {};
    for (let j = 0, temp = theData.length, length2 = temp < 17 ? temp : 17; j < length2; ++j) {
      person[columnList[j]] = theData[j]; // in case theData.length != 17
    }
    people.push(person);
  }
  return people;
};

exports.setupDatabase = (data, next) => {
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
    next(null, resp);
  }).catch((err) => {
    console.log('err in setup', err);
    next(err);
  });
};

exports.createUser = (data, next) => {
  client.create({
    index: 'ntuee',
    type: 'user',
    body: data,
  }, (error, response) => {
    next(error, response);
  });
};

/**
 *  success example:
 *  {
 *    "_index": "ntuee",
 *    "_type": "user",
 *    "_id": "1",
 *    "_version": 1,
 *    "found": true,
 *    "_source": {
 *      "school_id": "B70203011",
 *      "name": "何建勳"
 *    }
 *  }
*/

exports.getUserById = (id, next) => {
  client.get({
    index: 'ntuee',
    type: 'user',
    id, // id: id,
  }).then((resp) => {
    next(null, resp);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};

/**
 *  success example:
 *    {
 *      _index: 'ntuee',
 *      _type: 'user,
 *      _id: '1',
 *      _score: 3.7725885,
 *      _source: { school_id: 'B70203011', name: '何建勳' },
 *    }
 */

exports.getUserByAttr = (key, value, next) => {
  const pair = {};
  pair[key] = value;
  client.search({
    index: 'ntuee',
    type: 'user',
    body: {
      query: {
        match: pair,
      },
    },
  }).then((resp) => {
    if (resp.hits.hits.length !== 0) {
      next(null, resp.hits.hits[0]);
    } else {
      next(null, null);
    }
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};

/**
 *  success example:
 *  {
 *    "_index": "ntuee",
 *    "_type": "user",
 *    "_id": "1",
 *    "_version": 2,
 *    "_shards": {
 *      "total": 2,
 *      "successful": 1,
 *      "failed": 0
 *    }
 *  }
*/
exports.updateUserById = (id, doc, next) => {
  client.update({
    index: 'ntuee',
    type: 'user',
    id, // id: id,
    body: {
      doc, // doc, doc
    },
  }).then((resp) => {
    next(null, resp);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};

// same as getUserBySchoolId
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
    next(null, resp.hits.hits);
  }, (err) => {
    console.trace(err.message);
    next(err);
  });
};
