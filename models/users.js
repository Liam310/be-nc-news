const connection = require('../db/connection');

exports.fetchUserByUsername = username => {
  return connection('users')
    .select('*')
    .where('users.username', '=', username);
};
