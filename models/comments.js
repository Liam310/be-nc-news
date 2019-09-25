const connection = require('../db/connection');

exports.insertComment = ({ username, body }, { article_id }) => {
  return connection
    .insert({ author: username, article_id, body })
    .into('comments')
    .returning('*');
};
