const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';
// Only for linux users
// const info = require('./info');

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      // ...info
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // ...info
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
