const { expect } = require('chai');
const { formatDates, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when given an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('returns an array containing 1 object with its timestamp property converted to a JavaScript date object, but all other properties still same', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.instanceOf(Date);
    // CHECK ALL OTHER PROPERTIES ARE SAME
    for (key in input[0]) {
      if (key !== 'created_at') expect(output[0][key]).to.equal(input[0][key]);
    }
  });
  it('does not mutate array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);
    expect(input).to.eql([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
  it('returns an array containing several objects with their timestamp properties converted to JavaScript date objects', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    for (let i = 0; i < output.length; i++) {
      expect(output[i].created_at).to.be.instanceOf(Date);
    }
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('return a reference object containing one key/value pair when passed an array of 1 object', () => {
    const actual = makeRefObj(
      [
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100
        }
      ],
      'title',
      'article_id'
    );
    expect(actual).to.eql({ 'Living in the shadow of a great man': 1 });
  });
  it('does not mutate original array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    makeRefObj(input, 'title', 'article_id');
    expect(input).to.eql([
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
  it('returns a reference object containing matching key/value pairs when passed an array of multiple objects', () => {
    const input = [
      {
        article_id: 1,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      },
      {
        article_id: 2,
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171
      },
      {
        article_id: 3,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171
      },
      {
        article_id: 4,
        title: 'A',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Delicious tin of cat food',
        created_at: 911564514171
      }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    const expected = {
      'Eight pug gifs that remind me of mitch': 1,
      'Student SUES Mitch!': 2,
      'UNCOVERED: catspiracy to bring down democracy': 3,
      A: 4
    };
    expect(actual).to.eql(expected);
  });
});

describe('formatComments', () => {
  it('returns an empty array when passed empty array and empty object', () => {
    expect(formatComments([], {})).to.eql([]);
  });
  it('renames the created_by key of a single object nested in an array to be "author"', () => {
    const input = [
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ];
    const actual = formatComments(input, {});
    expect(actual[0].author).to.equal('icellusedkars');
    expect(actual[0].created_by).to.equal(undefined);
  });
  it('does not mutate original array', () => {
    const input = [
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ];
    formatComments(input, {});
    expect(input).to.eql([
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ]);
  });
  it('renames the belongs_to key of a single object nested in an array to be "article_id"', () => {
    const input = [
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ];
    const actual = formatComments(input, {
      'Living in the shadow of a great man': 5
    });
    expect(actual[0].article_id).to.equal(5);
    expect(actual[0].belongs_to).to.equal(undefined);
  });
  it('assigns the value of the article_id property to be the matching article_id given in the reference object (array containing 1 object)', () => {
    const input = [
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ];
    const refObj = { 'Living in the shadow of a great man': 5 };
    const actual = formatComments(input, refObj);
    expect(actual[0].article_id).to.equal(5);
  });
  it('converts the created_by property to a JavaScript date object', () => {
    const input = [
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ];
    const refObj = { 'Living in the shadow of a great man': 5 };
    const actual = formatComments(input, refObj);
    expect(actual[0].created_at).to.be.instanceOf(Date);
  });
  it('does not change the body or votes properties', () => {
    const input = [
      {
        body: 'Ambidextrous marsupial',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1195994163389
      }
    ];
    const refObj = { 'Living in the shadow of a great man': 5 };
    const actual = formatComments(input, refObj);
    expect(actual[0].body).to.equal(input[0].body);
    expect(actual[0].votes).to.equal(input[0].votes);
  });
  it('maintains the same functionality for array of multiple objects', () => {
    const input = [
      {
        body: 'Delicious crackerbreads',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1290602163389
      },
      {
        body: 'Superficially charming',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1259066163389
      },
      {
        body: 'git push origin master',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1227530163389
      }
    ];
    const refObj = { 'Living in the shadow of a great man': 5 };
    const actual = formatComments(input, refObj);

    actual.forEach((comment, index) => {
      expect(comment.article_id).to.equal(5);
      expect(comment.belongs_to).to.equal(undefined);
      expect(comment.created_at).to.be.instanceOf(Date);
      expect(comment.body).to.equal(input[index].body);
      expect(comment.votes).to.equal(input[index].votes);
    });
  });
});
