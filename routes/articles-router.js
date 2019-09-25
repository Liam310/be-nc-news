const articlesRouter = require('express').Router();
const { sendArticleById, updateArticle } = require('../controllers/articles');
const { handle405s } = require('../errors/index');

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticle)
  .all(handle405s);

module.exports = articlesRouter;
