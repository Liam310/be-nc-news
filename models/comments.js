const connection = require('../db/connection');

exports.insertComment = (username, body, article_id) => {
  return connection
    .insert({ author: username, article_id, body })
    .into('comments')
    .returning('*');
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  const validOrders = ['asc', 'desc'];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request!' });
  }
  return connection
    .select('*')
    .from('articles')
    .where('articles.article_id', '=', article_id)
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: 'Article not found!' });
    })
    .then(() => {
      return connection
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .from('comments')
        .where('comments.article_id', '=', article_id)
        .orderBy(sort_by, order);
    });
};

exports.modifyComment = (comment_id, inc_votes = 0) => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'Non-existent id!'
        });
      } else return article;
    });
};

exports.destroyComment = comment_id => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount < 1)
        return Promise.reject({ status: 404, msg: 'Non-existent id!' });
    });
};
