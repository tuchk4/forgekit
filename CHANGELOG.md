# 2.0.0 19.11.2016

* Code refactoring
* New Feature signature
* Supports hoc features
* Remove *.postForge()* feature
* More tests (100% coverage)
* Readable exceptions. Not more "undefined" Component or feature names in error's texts

Feature signature:

* As Function. It is default props feature.
* As Object. Allowed functions - *props* and *hoc*. props - it is default props feature. hoc - higher order component. Receive origin component and returns higher order component

```js
// 1. As props feature
Feature = function(props): newProps
Feature.propTypes = {}
Feature.defaultProps = {}

// 2. As props feature and hoc
Feature = {
  props: function(props): newProps,
  hoc: function(Component: React.Component): function(props): React.Component
}

Feature.propTypes = {}
Feature.defaultProps = {}
```

All props features (first case) normalized into Object:

```js
Feature = function(props): newProps;
Feature.propTypes = {}
Feature.defaultProps = {}

// is same with

Feature = {
  props: function(props): newProps;
};

Feature.propTypes = {}
Feature.defaultProps = {}
```

# 1.3.0 14.11.2016

* readonly propTypes and defaultProp
* withProps as function
* additional validation + readable errors

# 1.2.0 11.11.2016

* Refactor code and tests
* Test coverage now - 100%
* Add custom cross features property - *theme*.
* Add custom propType `import { ThemeProp } from 'forgekit'`
* Add npm script `npm run dev` that watch and build sources. Useful when use `npm link` for development and tests

Theme usage (more examples at docs and [release-1.2.0 tests](__tests__/release-1.2.0.js))

```js
import { ThemeProp } from 'forgekit';
import styles from './style.css';

const AwesomeComponent = () => {
  return <div>...</div/>
};

AwesomeComponent.propTypes = {
  theme: ThemeProp({
    base: PropTypes.string,
    style: PropTypes.string,
  }),
};

AwesomeComponent.defaultProps = {
  theme: {
    base: styles.base,
    style: styles.style,
  },
};

const feature = (props) => {...}
feature.propTypes = {
  theme: {
    awesome: PropTypes.string,
  }
}
```

```js
import feature from './feature';
import Component from './component';

import customStyles from './custom.css';

export default forge(feature1, feature2)(Component, 'ComponentName', {
  theme: {
    style: customStyles.style,
    awesome: customStyles.awesome
  }
});

// OR

const ForgedComponent = forge(feature1, feature2)(Component)

export default () =>{
  return (
    <ForgedComponent theme={{
      style: customStyles.style,
      awesome: customStyles.awesome
    }}/>
  );
}

```

# 1.1.0 26.10.2016

* postForge - feature static property. Function that will be executed after all component's feature. Accept component props and should return new props.

Feature signature:

```js
Feature = function(props): newProps;
Feature.propTypes = {};
Feature.defaultProps = {};
Feature.postForge = function(props): newProps;
```
