const connection = require('../db/connection');

exports.fetchArticleById = ({ article_id }) => {
  return connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .modify(query => {
      if (article_id) query.where('articles.article_id', '=', article_id);
    })
    .then(([article]) => {
      return article
        ? article
        : Promise.reject({ status: 404, msg: 'Non-existent id!' });
    });
};

exports.modifyArticle = ({ article_id }, { inc_votes }) => {
  return connection('articles')
    .where('articles.article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      return article
        ? article
        : Promise.reject({ status: 404, msg: 'Non-existent id!' });
    });
};
