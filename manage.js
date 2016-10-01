const elasticsearch = require('./server/elasticsearch');
// const googlesheet = require('./server/googlesheet');

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
      // const params = {
      //   sheet: 'B70',
      //   start: 'A2',
      //   end: 'Q',
      // };
      // googlesheet.getData(params, (rows) => {
      //   elasticsearch.setupDatabase(rows);
      // });
      const rows = [
        ['B70203011', '何建勳'],
        ['B70204018', '徐偉智'],
        ['B70501025', '呂堅平'],
      ];
      console.log('rows: ', rows);
      elasticsearch.setupDatabase(rows, () => {});
      break;
    } case '--createUser': {
      const data = {
        email: 'dummy@dummy',
        hashedPassword: 'dummy',
        hashedSessionId: 'nonsense',
        name: 'Dummy',
        // password: String, // Do not send the password back to client!!
        bio: 'I\'m dummy',
        address: 'Somewhere on the planet',
        phone: '02-8888-8888',
        mobile: '0900-000-000',
        personal_website: 'http://topjohnwu.github.io/donate/',
        facebook: 'http://topjohnwu.github.io/donate/',
        linkin: 'http://topjohnwu.github.io/donate/',
        ms: '',
        phd: '',
        searching_area: '',
      };
      elasticsearch.createUser(data, (error, response) => {
        console.log('err: ', error);
        console.log('res: ', response);
      });
      break;
    } case '--searchById': {
      const id = parseInt(process.argv[3], 10);
      elasticsearch.getUserById(id, (err, resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--searchBySchoolId': {
      const schoolId = process.argv[3];
      elasticsearch.getUserByAttr('school_id', schoolId, (err, resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--updateUserByEmail': {
      const email = 'dummy@dummy';
      const doc = {
        address: 'Does not exist on the planet',
      };
      elasticsearch.updateUserByEmail(email, doc, (err, resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--search': {
      const strings = process.argv.slice(3);
      console.log('strings: ', strings);
      elasticsearch.search(strings, (err, resp) => {
        console.log('manage', resp);
      });
      break;
    } case '--update': {
      const id = parseInt(process.argv[3], 10);
      const doc = {};
      doc[process.argv[4]] = process.argv[5];
      elasticsearch.updateUserById(id, doc, (err, resp) => {
        console.log('manage', resp);
      });
      break;
    } default: {
      console.log('argument not recognized...');
      break;
    }
  }
}
