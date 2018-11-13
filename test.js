const test = require('tape');
const unified = require('unified');
const remarkParse = require('remark-parse');
const inspect = require('unist-util-inspect');
const linkifyRegex = require('./index');

test('it lifts a nested list to the root level', t => {
  t.plan(2);

  const markdown = `
# Title

This is my friend: @6ilZq3kN0F

This is redundantly linked: [@6ilZq3kN0F](@6ilZq3kN0F)

cc [@alreadyLinked](@2RNGJafZt)
`;

  const actualInput = unified()
    .use(remarkParse, {commonmark: true})
    .parse(markdown);

  // console.log(JSON.stringify(actualInput));
  console.log(inspect(actualInput));

  const expectedInput = {
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [
          {
            type: 'text',
            value: 'Title',
            position: {
              start: {line: 2, column: 3, offset: 3},
              end: {line: 2, column: 8, offset: 8},
              indent: [],
            },
          },
        ],
        position: {
          start: {line: 2, column: 1, offset: 1},
          end: {line: 2, column: 8, offset: 8},
          indent: [],
        },
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'This is my friend: @6ilZq3kN0F',
            position: {
              start: {line: 4, column: 1, offset: 10},
              end: {line: 4, column: 31, offset: 40},
              indent: [],
            },
          },
        ],
        position: {
          start: {line: 4, column: 1, offset: 10},
          end: {line: 4, column: 31, offset: 40},
          indent: [],
        },
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'This is redundantly linked: ',
            position: {
              start: {line: 6, column: 1, offset: 42},
              end: {line: 6, column: 29, offset: 70},
              indent: [],
            },
          },
          {
            type: 'link',
            title: null,
            url: '@6ilZq3kN0F',
            children: [
              {
                type: 'text',
                value: '@6ilZq3kN0F',
                position: {
                  start: {line: 6, column: 30, offset: 71},
                  end: {line: 6, column: 41, offset: 82},
                  indent: [],
                },
              },
            ],
            position: {
              start: {line: 6, column: 29, offset: 70},
              end: {line: 6, column: 55, offset: 96},
              indent: [],
            },
          },
        ],
        position: {
          start: {line: 6, column: 1, offset: 42},
          end: {line: 6, column: 55, offset: 96},
          indent: [],
        },
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'cc ',
            position: {
              start: {line: 8, column: 1, offset: 98},
              end: {line: 8, column: 4, offset: 101},
              indent: [],
            },
          },
          {
            type: 'link',
            title: null,
            url: '@2RNGJafZt',
            children: [
              {
                type: 'text',
                value: '@alreadyLinked',
                position: {
                  start: {line: 8, column: 5, offset: 102},
                  end: {line: 8, column: 19, offset: 116},
                  indent: [],
                },
              },
            ],
            position: {
              start: {line: 8, column: 4, offset: 101},
              end: {line: 8, column: 32, offset: 129},
              indent: [],
            },
          },
        ],
        position: {
          start: {line: 8, column: 1, offset: 98},
          end: {line: 8, column: 32, offset: 129},
          indent: [],
        },
      },
    ],
    position: {
      start: {line: 1, column: 1, offset: 0},
      end: {line: 9, column: 1, offset: 130},
    },
  };
  t.deepEquals(actualInput, expectedInput, 'input looks good');

  const actualOutput = linkifyRegex(/\@[A-Za-z0-9]+\b/)()(actualInput);

  // console.log(JSON.stringify(actualOutput));
  console.log(inspect(actualOutput));

  const expectedOutput = {
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [{type: 'text', value: 'Title'}],
        position: {
          start: {line: 2, column: 1, offset: 1},
          end: {line: 2, column: 8, offset: 8},
          indent: [],
        },
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'This is my friend: '},
          {
            type: 'link',
            title: null,
            url: '@6ilZq3kN0F',
            children: [{type: 'text', value: '@6ilZq3kN0F'}],
          },
        ],
        position: {
          start: {line: 4, column: 1, offset: 10},
          end: {line: 4, column: 31, offset: 40},
          indent: [],
        },
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'This is redundantly linked: '},
          {
            type: 'link',
            title: null,
            url: '@6ilZq3kN0F',
            children: [
              {
                type: 'text',
                value: '@6ilZq3kN0F',
                position: {
                  start: {line: 6, column: 30, offset: 71},
                  end: {line: 6, column: 41, offset: 82},
                  indent: [],
                },
              },
            ],
            position: {
              start: {line: 6, column: 29, offset: 70},
              end: {line: 6, column: 55, offset: 96},
              indent: [],
            },
          },
        ],
        position: {
          start: {line: 6, column: 1, offset: 42},
          end: {line: 6, column: 55, offset: 96},
          indent: [],
        },
      },
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'cc '},
          {
            type: 'link',
            title: null,
            url: '@2RNGJafZt',
            children: [
              {
                type: 'text',
                value: '@alreadyLinked',
                position: {
                  start: {line: 8, column: 5, offset: 102},
                  end: {line: 8, column: 19, offset: 116},
                  indent: [],
                },
              },
            ],
            position: {
              start: {line: 8, column: 4, offset: 101},
              end: {line: 8, column: 32, offset: 129},
              indent: [],
            },
          },
        ],
        position: {
          start: {line: 8, column: 1, offset: 98},
          end: {line: 8, column: 32, offset: 129},
          indent: [],
        },
      },
    ],
    position: {
      start: {line: 1, column: 1, offset: 0},
      end: {line: 9, column: 1, offset: 130},
    },
  };

  t.deepEquals(actualOutput, expectedOutput, 'output looks good');
});
