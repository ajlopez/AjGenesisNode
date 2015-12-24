# AjGenesisNode

AjGenesisNode is a reimplementation of AjGenesis code generation engine, in Javascript/Node.js.

[Original Project AjGenesis](http://ajgenesis.codeplex.com/)

[Posts about Original Project](http://ajlopez.wordpress.com/category/ajgenesis/)

## Installation
Via npm on Node:
```
npm install ajgenesis
```

Reference in your program:
```js
var ajgenesis = require('ajgenesis');
```

## Development
```
git clone git://github.com/ajlopez/AjGenesisNode.git
cd AjGenesisNode
npm install
npm test
```

## Samples

TBD

## Versions

- 0.0.1: Published
- 0.0.2: Published. New modules
- 0.0.3: Published. New module invocation, using ajgenesis and options
- 0.0.4: Published. Using runit to load modules and install them globally. Calling modules with a callback.
- 0.0.5: Published. Load model from file or directory. Copy File. Copy Directory. Local tasks in `ajgenesis/tasks` directory.
Local modules in `ajgenesis/modules` directory.
- 0.0.6: Published. Global command loads model from `models` directory if exists.
- 0.0.7: Published. Fix bug in load model from directory.
- 0.0.8: Published. Fix bug in bin, and weird \r\n issue, removed to \n, for Linux
- 0.0.9: Published. Updated to use SimpleTpl 0.0.2 and SimpleUnit 0.0.4
- 0.0.10: Published. Use of `ajgenesis/models`. Support `ajgenesis file preserve`. Remove `runit` and `node-uuid` dependencies
- 0.0.11: Published. Preserve regions by name. createModelDirectory, getModelDirectory
- 0.0.12: Published. Install method
- 0.0.13: Published. Using simplejson to load model
- 0.0.14: Published. New install verb. New ajgenesis.fs, ajgenesis.modules functions

## Contribution

Feel free to [file issues](https://github.com/ajlopez/AjGenesisNode) and submit
[pull requests](https://github.com/ajlopez/AjGenesisNode/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.
