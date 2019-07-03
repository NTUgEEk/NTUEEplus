# NTUEEplus

#### starting production server
NTUEEplus runs as a docker-compose service on ntuee.org
As `ntuee` user on the server, run
````$ cd ~/production
$ docker-compose restart plus
````

#### build front end
As `ntuee` user
````$ cd ~/production/NTUEEplus
$ npm run build
````

#### starting elasticsearch database
As `ntuee` user on the server, run
````$ cd ~/production
$ docker-compose restart elasticsearch
````

#### interfacing with the database
To talk directly to the elasticsearch server, run as `ntuee` user
````$ cd ~/production
$ docker-compose exec elasticsearch
# curl -XGET 'http://localhost:9200/'
````

#### update alumni data
When an user opens an new account, the data (name/student ID) is checked with a local data file.
Put the data in `studentdata.csv`, for the format please refer to the existing data on the server (`/home/ntuee/production/NTUEEplus/`).
Please ensure that this file is in `.gitignore` to prevent alumni data from being uploaded to github.

#### starting a database server for local development use
Download [elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html) and open local database (localhost:9200)

```bash
$ elasticsearch/bin/elasticsearch
```

#### starting local dev server
```bash
$ npm run start
```

#### test database
See commands:
```bash
$ node manage.js --help
```
