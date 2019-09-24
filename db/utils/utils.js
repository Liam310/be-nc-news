const _ = require('lodash');

exports.formatDates = list => {
  const listCopy = _.cloneDeep(list);
  for (let i = 0; i < listCopy.length; i++) {
    listCopy[i].created_at = new Date(listCopy[i].created_at);
  }
  return listCopy;
};

exports.makeRefObj = list => {
  return list.reduce((referenceObj, currentObj) => {
    referenceObj[currentObj.title] = currentObj.article_id;
    return referenceObj;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];
  const commentsCopy = _.cloneDeep(comments);
  commentsCopy.forEach(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    comment.created_at = new Date(comment.created_at);
  });
  return commentsCopy;
};
