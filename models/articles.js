const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
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

exports.modifyArticle = (article_id, inc_votes) => {
  return connection('articles')
    .where('articles.article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: 'Non-existent id!'
        });
      } else if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: 'No inc_votes property provided!'
        });
      } else return article;
    });
};

exports.fetchArticles = (
  sortBy = 'created_at',
  order = 'desc',
  author,
  topic
) => {
  const validOrders = ['asc', 'desc'];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request!' });
  } else {
    return connection
      .select(
        'articles.author',
        'articles.title',
        'articles.article_id',
        'articles.topic',
        'articles.created_at',
        'articles.votes'
      )
      .count({ comment_count: 'comment_id' })
      .from('articles')
      .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
      .groupBy('articles.article_id')
      .orderBy(sortBy, order)
      .modify(query => {
        if (author) query.where('articles.author', '=', author);
        if (topic) query.where('articles.topic', '=', topic);
      });
  }
};
