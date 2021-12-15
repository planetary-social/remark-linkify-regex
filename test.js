const test = require('tape');
// const unified = require('unified');
const remarkParse = require('remark-parse');
// const inspect = require('unist-util-inspect');
const linkifyRegex = require('./index');
const remark = require('remark');

const markdown = `
# Title

This is my friend: @6ilZq3kN0F

this is a #tag

This is redundantly linked: [@6ilZq3kN0F](@6ilZq3kN0F)

cc [@alreadyLinked](@2RNGJafZt)
`;

var linkifyHashtags = linkifyRegex(/#[\w-]+/g);

test('it creates links from hashtag text without a transform function', t => {
  t.plan(1);

  // this returns markdown content
  const output = remark()
      .use(linkifyHashtags)
      .use(remarkParse, { commonmark: true })
      .processSync(markdown).contents;

  // console.log('**output**', JSON.stringify(output, null, 2))

  t.ok(output.includes('[#tag](#tag)'),
      'should include the transformed tag URL')
});

test('creates URLs with a given function', t => {
  t.plan(1)

  const linkifyHashtags = linkifyRegex(/#[\w-]+/g, node => {
    return '/foo/' + node.substring(1)
  });

  const output = remark()
      .use(linkifyHashtags)
      .use(remarkParse, { commonmark: true })
      .processSync(markdown).contents;

    t.ok(output.includes('[#tag](/foo/tag)'))
})
