# NTUEEplus

#### starting a local database for local development use
Download [elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html) and open local database (localhost:9200)

```bash
$ elasticsearch/bin/elasticsearch
```

#### test database
See commands:
```bash
$ node manage.js --help
```

#### starting dev server
```bash
$ npm run start
```

#### starting production server
NTUEEplus runs as a docker-compose service on ntuee.org
As `ntuee` user on the server, run
````$ cd ~/production
$ docker-compose restart plus
````

#### upload alumni data
When an user opens an new account, the data (name/student ID) is checked with a local data file.
Put the data in `studentdata.csv`, for the format please refer to the existing data on the server (`/home/ntuee/production/NTUEEplus/`).
Please ensure that this file is in `.gitignore`.
