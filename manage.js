// const elasticsearch = require('./server/elasticsearch');
const googlesheet = require('./server/googlesheet');

if ((process.argv).length > 2) {
  const cmd = process.argv[2];
  if (cmd === '--help') {
    console.log(
      '  --setup      to set up database.'
    );
  } else if (cmd === '--setup') {
    const params = {
      sheet: 'B70',
      start: 'A2',
      end: 'Q',
    };
    googlesheet.getData(params, (rows) => {
      // elasticsearch.setupDatabase(rows);
    });
  }
}
