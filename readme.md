# remark-linkify-regex

Given markdown text nodes, find textual matches of a RegExp, and replace those matches with link nodes.

## Installation

```sh
npm install -S @planetary-ssb/remark-linkify-regex
```

## Usage

Note: the API is not a remark plugin directly, instead it's a factory for a plugin. You must call the factory with a regex, and optionally a function to transform the matching regex into a URL.

```js
// ...
var linkifyRegex = require('@planetary-ssb/remark-linkify-regex');
const remarkParse = require('remark-parse');
const remark = require('remark');

const markdown = `
# Title

this is a #tag
`;

const output = remark()
   // pass in a function that transforms the hashtag into a URL
   .use(linkifyRegex(/#[\w-]+/g, node => {
      return '/foo/' + node.substring(1)
      // return '/foo/tag'
   })
   .use(remarkParse, { commonmark: true })
   .processSync(markdown).contents;
```

## License

[MIT](LICENSE)
