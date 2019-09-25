const { insertComment } = require('../models/comments');

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
