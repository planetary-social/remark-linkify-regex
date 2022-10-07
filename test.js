const test = require('tape')
// const unified = require('unified');
const remarkParse = require('remark-parse')
// const inspect = require('unist-util-inspect');
const linkifyRegex = require('./index')
const remark = require('remark')

const markdown = `
# Title

This is my friend: @6ilZq3kN0F

this is a #tag

This is redundantly linked: [@6ilZq3kN0F](@6ilZq3kN0F)

cc [@alreadyLinked](@2RNGJafZt)
`;

const hashtagRegex = /#[\w-]+/g

test('hashtag regex - creates links without transform function', t => {
  t.plan(1);

  
  const linkifyHashtags = linkifyRegex(hashtagRegex)

  const output = remark()
      .use(linkifyHashtags)
      .use(remarkParse, { commonmark: true })
      .processSync(markdown).contents

  t.true(
    output.includes('[#tag](#tag)'),
    'should include the transformed tag URL'
  )
})

test('hashtag regex - creates links with transform function', t => {
  t.plan(1)

  const linkifyHashtags = linkifyRegex(hashtagRegex, (node) => {
    return '/foo/' + node.substring(1)
  })

  const output = remark()
      .use(linkifyHashtags)
      .use(remarkParse, { commonmark: true })
      .processSync(markdown).contents

  t.true(
    output.includes('[#tag](/foo/tag)'),
    'replaces hashtag with link'
  )
})
