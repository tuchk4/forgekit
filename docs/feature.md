# Little theory. What is component feature?

- [The problem](#the-problem)
- [Component life in the images](#component-life-in-the-images)
- [Solution: develop features separately](#solution-develop-features-separately)
- [High-level and low-level props](#high-level-and-low-level-props)
- [Forgekit feature function](#forgekit-feature-function)
- [Forgekit feature with lifecycle methods](#forgekit-feature-with-lifecycle-methods)

> Wiki: It is an intentional distinguishing characteristic of a component.

Component feature - is the new component functionality. And in most cases it depends and provide new props.
For example *HighliteFlags* feature for `<Button/>` component - add *success*, *alert* and *warning* bool props and depending on them provide specific styles.

### The problem

Usually all such features are developed and stored inside component and this is the reason for next problems:

* Component code become more and more complex. Even simple component can grow into complex with large collection of available props.
* Hard to develop new features and remove old or not used. To remove feature developer should find and remove large number of lines and then make sure that all other features work correctly.
* Hard to find bugs and fix them. Sometimes there are hotfixes that usually push component to become legacy.
* A lot of *copy-paste* code. Especially a lot of duplication across components *propTypes*.
* Hard to share code. Only whole component could be shared with all implemented features. But sometimes needs to share only specific feature between components or even between applications.

### Component life in the images

* Component is simple and it code is beautiful, simple and readable.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/master/docs/images/component.png">

* Developing new component features. Developing at this stage is like breathe the crystal clear air. Component is still virgin.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/master/docs/images/component-with-features.png">

* Component became complex and it code is much harder and uglier than was before.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/master/docs/images/component-with-added-features.png">

* DEATH - bugs, legacy code, spaghetti :( Components look like virus or infection.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/master/docs/images/component-became-complex.png">

### Solution: develop features separately

**Very need to rename *"Feature"* term at Forgekit context into more simple name that will not confuse.** If you have some ideas - please describe them at [new issue](https://github.com/tuchk4/forgekit/issues/new).

Forgekit suggest to develop and store features separately from components. There are a lot of advantages:

* Responsibility. Each feature stored at separated file (or module if speak in CommonJS context) and there is code that implements only specific functionality and provide its own *propsTypes*.
* Sharable. Features could be shared between components or applications. And don't even depends on components library. It could work above it.
* Tests. Easy to write tests because Feature is a pure function.
* Refactoring. It is more simpler to remove feature import than find and remove large number of related lines of code.
* Refactoring. Old feature could be swapped with new features.
* Optimization. Use only needed features. Not used features will not be in the build.
* Feature customization. Each feature could be customized separately. This is much better that customize whole component.


### High-level and low-level props

In most cases feature depends and provide new props.
Props could be splitted into **low-level** and **high-level** props.

From React [DOM Elements](https://facebook.github.io/react/docs/dom-elements.html) documentation:

> React implements a browser-independent DOM system for performance and cross-browser compatibility. We took the opportunity to clean up a few rough edges in browser DOM implementations.
In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute tabindex corresponds to the attribute tabIndex in React. The exception is aria-* and data-* attributes, which should be lowercased.

So all DOM attributes and *children* prop are **low-level** props.
**high-level** props - are custom props.

In all cases **high-level** props always affects on **low-level** props.
That is why most features could be implemented by mapping props before *render*. And it is better than create higher order component for each feature or develop all features inside component.

It is looks like props middlewares (or like props micro services).
It does not generate higher order components so it will not affect on performance.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/master/docs/images/props-as-middleware.png">

### Forgekit feature function

Forgekit feature is a pure functions that:

* provide *propTypes* and *defaultProps*
* takes props as argument and returns new props
* provide its own theme structure ([more about themes](./theme.md))

```js
Feature = function(props): newProps
Feature.propTypes = {}
Feature.defaultProps = {}
```

### Forgekit feature with lifecycle methods

Forgekit feature also could be defined as object with two attributes:

* *props* - pure function to map props.
* *hoc* - higher order component. Takes Component as argument and return higher order component.

```js
Feature = {
  props: function(props): newProps,
  hoc: function(Component: React.Component): function(props): React.Component
}

Feature.propTypes = {}
Feature.defaultProps = {}
```

Example:

```js
class HOC extends React.Component {
  comopnenDidMount() {}

  componentWillUnmount() {}

  render() {
    return this.props.children;
  }
}

const Feature = {
  hoc: Component => {
    return props => {
      return (
        <Hoc>
          <Component {...props} />
        </Hoc>
      );
    }
  }
}
```
