const connection = require('../db/connection');

exports.fetchUserByUsername = username => {
  return connection('users')
    .select('*')
    .where('users.username', '=', username)
    .then(([user]) => {
      return user
        ? user
        : Promise.reject({ status: 404, msg: 'Not a valid username!' });
    });
};

exports.fetchUsers = () => {
  return connection('users').select('*');
};
