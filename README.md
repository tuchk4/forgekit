# <a href="https://github.com/tuchk4/forgekit"><img src="https://raw.githubusercontent.com/tuchk4/forgekit/master/logo/forgekit-logo-small.png"></a>

![React feature kit travis build](https://api.travis-ci.org/tuchk4/forgekit.svg?branch=master)

## Tests

![Forgekit tests](https://monosnap.com/file/8gbOKs3JgGHs8de5G3GZr2MNsO75SQ.png)

## Motivation

> NOTE: README IS NOT COMPLETE

[recompose](https://github.com/acdlite/recompose) — great library for React components. It is *lodash* for React components.
Seems that all this stuff could be done with *mapProps()* hoc. But not. For result component we should merge all propTypes and defaultProps.

## Little theory

What is a new feature for component?
Adding a new high-level properties to component that affects on low-level properties.
Low-level properties are:

* className
* style
* on(Event) callbacks
* children

For example "Highlite flags" feature — adding flags like *success*, *danger*, *warning*, *alert* to component. Depends on current flag - change Component's color. As the result - we should change component *className* or *style*. So this feature affects on *className* or *style* low-level property.

--- image 1: props -> component -> dom
--- image 2: (props -> f1(prop)->f2(prop)->fn(prop)) -> component -> dom

## Feature signature
```js
Feature = function(props): newProps;
Feature.propTypes = {};
Feature.defaultProps = {};
Feature.postForge = function(props): newProps;
```

* Feature - function that accept properties and return new properties
* Feature.propTypes - same as React component *propTypes*
* Feature.defaultProps - same as React component *deafultProps*
* Feature.postForge - function that is executed after all features have been applied. Accept properties and return new properties

## Forgekit api

```js
forge(...features)(Component, displayName);
```

There is forgekit-component repository with additional examples and storybook.

## Installation

To install the stable version:

```
npm install --save forgekit
```

## Forgekit advantages

* Easy to write and understand code — feature is a simple function
* Use only needed features. 
* No extra code at app build because you import only needed features
* Feature could be used for few components. So no code duplication.
* Clear code responsibility. Each feature — separated file (module) and there is no extra code. Only feature implementation. Very boost code reading and understanding.
* Easy to remove features from components — just remove feature import. Instead of removing number of lines from the component.

For existing components or components libraries:

* Don’t need to contribute to whole library
* Don’t need to work with whole library

Just create deploy features as separated repository or features library.

## Examples

----

## Footnotes

Always use React storybook or similar tool for dumb react components.
Suggested storybook addons:

* Add with info
* REAMDE
* Knobs
