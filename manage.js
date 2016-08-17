const elasticsearch = require('./server/elasticsearch');
const googlesheet = require('./server/googlesheet');

if ((process.argv).length > 2) {
  switch (process.argv[2]) {
    case '--help': {
      console.log(
        '   --setup      (set up the database)\n',
        '  --searchById ID\n',
        '  --searchBySchoolId SCHOOLID\n',
        '  --search [...STRINGS]\n',
        '  --update ID FIELD VALUE\n'
      );
      break;
    } case '--setup': {
      const params = {
        sheet: 'B70',
        start: 'A2',
        end: 'Q',
      };
      googlesheet.getData(params, (rows) => {
        elasticsearch.setupDatabase(rows);
      });
      break;
    } case '--searchById': {
      const id = parseInt(process.argv[3], 10);
      elasticsearch.getUserById(id, (resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--searchBySchoolId': {
      const schoolId = process.argv[3];
      elasticsearch.getUserBySchool_Id(schoolId, (resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--search': {
      const strings = process.argv.slice(3);
      console.log('strings: ', strings);
      elasticsearch.search(strings, (resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--update': {
      const id = parseInt(process.argv[3], 10);
      const doc = {};
      doc[process.argv[4]] = process.argv[5];
      elasticsearch.updateUserById(id, doc, (resp) => {
        console.log('manage', resp);
      });
      break;
    } default: {
      console.log('argument not recognized...');
      break;
    }
  }
}
