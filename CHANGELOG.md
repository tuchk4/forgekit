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
  return <div>...</div?
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
