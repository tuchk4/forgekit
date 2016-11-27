### Little theory. What is component feature?

> It is an intentional distinguishing characteristic of a component.

Component feature - is the new component's functionality. And in most cases it depends and provide new props.
For example *HighliteFlags* feature for *<Button/>* component - add *success*, *alert* and *warning* bool props and depending on them provide specific styles.
Usually all such features are developed and stored inside component and this is the reason for next problems:

* Component's code become more and more complex. Even simple component can grow into complex component with large collection of available props.
* Hard to develop new features and remove old or not used. To remove feature developer should find and remove large number of lines and then make sure that all other features work correctly.
* Hard to find bugs and fix them. Sometimes there are hotfixes that usually push component become legacy.
* A lot of *copy-paste* code. Especially a lot of duplication across component's *propTypes*.
* Hard to share code. Only whole component could be shared with all implemented features. But sometimes needs to share only specific feature between applications or even between components.

### Component lifecycle in the images

* Component is simple and it's code is beautiful, simple and readable

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/component.png">

* Developing new component's features

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/component-with-features.png">

* Component became complex and it's code is much harder and uglier than was before

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/component-with-added-features.png">

* DEATH - bugs, legacy code, spaghetti :(

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/component-became-complex.png">

### Develop features separately

Forgekit suggest to develop and store features separately from component. There are a lof of advantages:

* Responsibility. Each feature stored separated file (or module if speak in CommonJS context) and there is code that implements only specific functionality and provide props that are needed only for its functionality.
* Sharable. Features could be shared between components or applications.
* Tests. Easy to write tests because Feature is a pure function.
* Refactoring. It is more simpler to remove feature's import than find and remove large number of related lines of code
* Refactoring. Old feature could be swapped with new features.
* Optimization. Use only needed features.
* Feature customization. Each feature could customized separately. This is much better that customize whole component.


### High-level and Low-level props

In most cases feature depends and provide new props.
Props could be splitted into **low-level** and **high-level** props.

From React documentation - [DOM Elements](https://facebook.github.io/react/docs/dom-elements.html):

> React implements a browser-independent DOM system for performance and cross-browser compatibility. We took the opportunity to clean up a few rough edges in browser DOM implementations.
In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute tabindex corresponds to the attribute tabIndex in React. The exception is aria-* and data-* attributes, which should be lowercased.

So all DOM attributes and *children* prop are **low-level** props.
**high-level** props - are custom props.

In all cases **high-level** props always affects on **low-level** props.
That is why most features could be implemented by mapping props before *render*. And it is better than create higher order component for each feature or develop all features inside component.

It is looks like props middlewares (or like props micro services).
It does not generate higher order components so it will not affect on performance.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/props-as-middleware.png">

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

Forgekit feature could be defined as object with two attributes:

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
