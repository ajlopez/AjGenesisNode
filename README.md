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

## Contribution

Feel free to [file issues](https://github.com/ajlopez/AjGenesisNode) and submit
[pull requests](https://github.com/ajlopez/AjGenesisNode/pulls) � contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.
