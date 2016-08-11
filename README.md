# React 15 Migration Analyzer

This repo contains a series of read-only codemods (using [JSCodeShift](https://github.com/facebook/jscodeshift/)) that will help you or your team determine the amount of work necessary to upgrade from React version 0.14 to 15. These codemods will _not_ modify your code - they will simply spit out detailed info about files/locations that need to be updated to remove unsupported APIs.

## Current Analyzers

1. [`deprecated-addons`](deprecated-addons.js)
2. [`deprecated-react-methods`](deprecated-react-methods.js)

## TODO

Finish adding analyzers to account for the rest of the [removed deprecations](https://facebook.github.io/react/blog/2016/04/07/react-v15.html#removed-deprecations) in the React 15 removed deprecations list.
