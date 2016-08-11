/*
    https://facebook.github.io/react/blog/2016/04/07/react-v15.html#removed-deprecations
    Deprecated APIs are removed from the React top-level export: findDOMNode, render, renderToString, renderToStaticMarkup, and unmountComponentAtNode. As a reminder, they are now available on ReactDOM and ReactDOMServer.
    @jimfb in #5832
*/

const deprecatedMethods = [
    'findDOMNode',
    'render',
    'renderToString',
    'renderToStaticMarkup',
    'unmountComponentAtNode'
];

export default function transformer(file, api) {
  const { jscodeshift: j, stats } = api;
  let root;

  try {
      root = j(file.source);
  } catch (err) {
      // parse error - bail out
      return;
  }

  const getReactIdentifier = () => {
      let reactIdentifier;

      root.find(j.ImportDeclaration, {
          source: { value: val => ['react', 'React'].includes(val) }
      }).forEach(p => {
          const defaultSpecifier = p.node.specifiers.find(s => s.type === 'ImportDefaultSpecifier');
          reactIdentifier = defaultSpecifier && defaultSpecifier.local.name;
      });

      if (reactIdentifier) return reactIdentifier;

      root.find(j.CallExpression, {
          callee: { name: 'require' },
          arguments: args => args.filter(arg => ['react', 'React'].includes(arg.value)).length
      }).forEach(p => {
          const varDecl = j(p).closest(j.VariableDeclarator);
          reactIdentifier = varDecl.size() && varDecl.get().node.id.name;
      });

      return reactIdentifier;
  };

  const reactIdentifier = getReactIdentifier();
  if (!reactIdentifier) return;

  root.find(j.CallExpression, {
      callee: {
          property: obj => deprecatedMethods.includes(obj.name),
          object: { name: reactIdentifier }
      }
  }).forEach(({ node }) => {
     const { line, column } = node.loc.start;
     console.log(
         `${line}:${column} - Deprecated usage of ${reactIdentifier}.${node.callee.property.name} in ${file.path}`
     );
  });
};
