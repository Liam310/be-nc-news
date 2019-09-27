\c nc_news_test

SELECT articles.author, comment_id, topic, articles.article_id, articles.votes FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id;