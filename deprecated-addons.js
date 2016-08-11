/*
    https://facebook.github.io/react/blog/2016/04/07/react-v15.html#removed-deprecations
    Deprecated addons are removed: batchedUpdates and cloneWithProps. @jimfb in #5859, @zpao in #6016
*/

export default function transformer(file, api) {
    const { jscodeshift: j, stats } = api;
    let root;

    try {
        root = j(file.source);
    } catch (err) {
        // parse error - bail out
        return;
    }

    root.find(j.CallExpression, {
        callee: {
            property: node => ['cloneWithProps', 'batchedUpdates'].includes(node.name)
        }
    }).forEach(({ node }) => {
        const { line, column } = node.loc.start;
        console.log(
            `${line}:${column} - Deprecated usage of ${node.callee.property.name} in ${file.path}`
        );
    });
};
