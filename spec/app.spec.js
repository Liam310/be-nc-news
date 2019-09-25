process.env.NODE_ENV = 'test';

const { expect } = require('chai');
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
      describe.only('PATCH', () => {
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
      });
      describe('INVALID METHOD', () => {
        it('status 405: responds with a message when sent a put, patch, post, or delete', () => {
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
    });
  });
});
