process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('/api', () => {
  it('status 404: sends "path not found" message when sent a request for non-existent path', () => {
    return request(app)
      .get('/flop')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('Path not found!');
      });
  });
  describe('/topics', () => {
    describe('GET', () => {
      it('status 200: sends an object containing an array of all the topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.eql([
              { slug: 'mitch', description: 'The man, the Mitch, the legend' },
              { slug: 'cats', description: 'Not dogs' },
              { slug: 'paper', description: 'what books are made of' }
            ]);
          });
      });
    });
    describe('INVALID METHOD', () => {
      it('status 405: responds with a message when sent a put, patch, post, or delete', () => {
        const invalidMethods = ['put', 'patch', 'post', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        it('status 200: sends back user info', () => {
          return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.eql({
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
              });
            });
        });
        it('status 404: valid username, does not exist', () => {
          return request(app)
            .get('/api/users/thisisnotausername')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Not a valid username!');
            });
        });
      });
      describe('INVALID METHOD', () => {
        it('status 405: responds with a message when sent a put, patch, post, or delete', () => {
          const invalidMethods = ['put', 'patch', 'post', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/butter_bridge')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method not allowed!');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe('/articles', () => {
    describe('GET', () => {
      it('status 200: responds with an array of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles.length).to.equal(12);
            expect(articles[0]).to.have.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
          });
      });
      it('status 200: default sorts by created_at key in descending order', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('created_at');
          });
      });
      it('status 200: sorts by specified sort_by query', () => {
        return request(app)
          .get('/api/articles/?sort_by=author')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('author');
          });
      });
      it('status 200: sorts by specified order query', () => {
        return request(app)
          .get('/api/articles/?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy('created_at');
          });
      });
      it('status 200: filters by specified author query', () => {
        return request(app)
          .get('/api/articles/?author=butter_bridge')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(3);
            articles.forEach(article => {
              expect(article.author).to.equal('butter_bridge');
            });
          });
      });
      it('status 200: filters by specified topic query', () => {
        return request(app)
          .get('/api/articles/?topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(11);
            articles.forEach(article => {
              expect(article.topic).to.equal('mitch');
            });
          });
      });
      it('status 200: responds with empty array when given an author query that matches no articles', () => {
        return request(app)
          .get('/api/articles/?author=lurker')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it('status 200: responds with empty array when given a topic query that matches no articles', () => {
        return request(app)
          .get('/api/articles/?topic=totalnonsense')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it('status 400: attempt to sort_by a non-existent column', () => {
        return request(app)
          .get('/api/articles/?sort_by=yeet')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request!');
          });
      });
      it('status 400: attempt to order by something other than ascending or descending', () => {
        return request(app)
          .get('/api/articles/?order=yeet')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request!');
          });
      });
    });
    describe('/:article_id', () => {
      describe('GET', () => {
        it('status 200: responds with an article object containing all keys including a comment_count with the right value', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes',
                'comment_count'
              );
              expect(article.comment_count).to.equal('13');
            });
        });
        it('status 404: valid id, does not exist', () => {
          return request(app)
            .get('/api/articles/29')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Non-existent id!');
            });
        });
        it('status 400: invalid id', () => {
          return request(app)
            .get('/api/articles/yeet')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request!');
            });
        });
      });
      describe('PATCH', () => {
        it('status 200: update vote count and respond with updated article', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 9 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes'
              );
              expect(article.votes).to.equal(109);
            });
        });
        it('status 404: valid id, does not exist', () => {
          return request(app)
            .patch('/api/articles/29')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Non-existent id!');
            });
        });
        it('status 400: invalid id', () => {
          return request(app)
            .patch('/api/articles/nonsense')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request!');
            });
        });
        it('status 400: invalid data type for inc_votes', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'yeet' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request!');
            });
        });
        it('status 400: request body does not contain inc_votes key', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ ink_vetos: 7 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('No inc_votes property provided!');
            });
        });
      });
      describe('INVALID METHOD', () => {
        it('status 405: responds with a message when sent a put, post, or delete', () => {
          const invalidMethods = ['put', 'post', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/articles/2')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method not allowed!');
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe('/comments', () => {
        describe('POST', () => {
          it('status 201: posts a comment and responds with posted comment', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'butter_bridge',
                body: "This Mitch guy really knows what's up."
              })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment).to.contain.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body'
                );
                expect(comment.username).to.equal();
              });
          });
          it('status 400: given input is missing a body', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 'butter_bridge' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request!');
              });
          });
          it('status 400: given input is missing a username', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ body: 'this is a comment' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request!');
              });
          });
          it('status 400: article_id is of invalid type', () => {
            return request(app)
              .post('/api/articles/yes/comments')
              .send({ username: 'butter_bridge', body: 'this is a comment' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request!');
              });
          });
          it('status 422: article_id is not present in articles table', () => {
            return request(app)
              .post('/api/articles/1001/comments')
              .send({
                username: 'butter_bridge',
                body: "This Mitch guy really knows what's up."
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Unprocessable entity!');
              });
          });
          it('status 422: username is not present in users table', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'yeet',
                body: "This Mitch guy really knows what's up."
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Unprocessable entity!');
              });
          });
        });
        describe('GET', () => {
          it('status 200: responds with an array of comments on an article', () => {
            return request(app)
              .get('/api/articles/5/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(2);
                expect(comments[0]).to.have.keys(
                  'comment_id',
                  'votes',
                  'created_at',
                  'author',
                  'body'
                );
              });
          });
          it('status 200: default to sorting by the created_at values in descending order', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy('created_at');
              });
          });
          it('status 200: sorts by specified sort_by query', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=author')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy('author');
              });
          });
          it('status 200: sorts by specified order query', () => {
            return request(app)
              .get('/api/articles/1/comments?order=asc')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.ascendingBy('created_at');
              });
          });
          it('status 200: responds with empty array when article has no comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(0);
              });
          });
          it('status 400: attempt to sort_by a non-existent column', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=yeet')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request!');
              });
          });
          it('status 400: attempt to order by something other than ascending or descending', () => {
            return request(app)
              .get('/api/articles/1/comments?order=yeet')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request!');
              });
          });
          it('status 404: no such article_id exists', () => {
            return request(app)
              .get('/api/articles/100000/comments')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Article not found!');
              });
          });
          it('status 400: invalid format for article_id', () => {
            return request(app)
              .get('/api/articles/yeet/comments')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Bad request!');
              });
          });
        });
        describe('INVALID METHODS', () => {
          it('status 405: responds with a message when sent a put, patch, or delete', () => {
            const invalidMethods = ['put', 'patch', 'delete'];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/2/comments')
                .send({ username: 'butter_bridge', body: 'this is a comment' })
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method not allowed!');
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
    describe('INVALID METHODS', () => {
      it('status 405: responds with a message when sent a put, patch, post, or delete', () => {
        const invalidMethods = ['put', 'patch', 'post', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles/')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe.only('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('status 200: responds with updated comment', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 3 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment[0]).to.contain.keys(
                'author',
                'comment_id',
                'article_id',
                'body',
                'created_at',
                'votes'
              );
              expect(comment[0].votes).to.equal(19);
            });
        });
      });
    });
  });
});
