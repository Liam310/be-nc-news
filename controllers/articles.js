const {
  fetchArticleById,
  modifyArticle,
  fetchArticles
} = require('../models/articles');

exports.sendArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  modifyArticle(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchArticles(sort_by, order).then(articles => {
    res.status(200).send({ articles });
  });
};
