/*
  Superplayer Project
  (c) 2019 Alexandre Mulatinho
*/

const env  = process.env.NODE_ENV || "development";
const path = require('path')

const config = {
  development: {
    web: { port: 8000 },
    database: {
      name: 'project_dev',
      options: {
        host: 'localhost',
        dialect: 'sqlite',
        storage: __dirname + '/../data/project_dev.sqlite3',
        pool: { max: 5, min: 1, idle: 10000 },
        logging: console.log
      }
    }
  }
};


module.exports = config[env];
