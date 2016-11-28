# Theme

- [Forgekit theme api](#forgekit-theme-api)
  - [What is the ThemeProp?](#what-is-the-themeprop)
- [Theme className example](#theme-classname-example)
- [Theme styles example](#theme-styles-example)

Allows to define theme structure for feature or component. It is used for *classNames* or *style* calculating.
Support custom themes provided by global CSS or inline styles and other libraries:

* [CSS Modules](https://github.com/css-modules/css-modules)
* [Aphrodite](https://github.com/Khan/aphrodite)
* [Radium](http://formidable.com/open-source/radium/)
* [React Style](https://github.com/js-next/react-style)
* [JSS](https://github.com/cssinjs/jss)

**What is theme?**

Simple styling manager for the React components.

Theme structure is defined at *propTypes* and default values defined at *defaultProps*.
So *theme* is the component prop.

```js
<Component theme={theme} />
```

**Why theme is important for features?**

A lot of features usually provides new UI elements for component. So - they should/may be customized.

## Forgekit theme api

Theme structure should be defined at the *propTypes*.

Default theme values should be defined at *defaultProps*.

All defined themes are merged in the ForgedComponent.
Each feature or component will receive only defined theme structure.

```js
import { ThemeProp } from 'forgekit';

Feature1.propTypes = {
  theme: ThemeProp({
    foo: PropTypes.string,
    bar: PropTypes.string
  })
};

Feature2.propTypes = {
  theme: ThemeProp({
    baz: PropTypes.string
  })
};

const ForgedComponent = forge(Feature1, Feature2)(Component);

expect(ForgedComponent.propTypes.theme).toEqual({
  ...Feature1.propTypes.theme,
  ...Feature2.propTypes.theme,
});
```

### What is the ThemeProp?

*ThemeProp* is same as *PropTypes.shape* but with attribute that contains all defined keys. Forgekit needs it for theme merging.

*PropTypes.shape* cannot be used directly because it is a bound function and there are no access to defined shape attributes.

```js
const ThemeProp = theme => {
  const themeShape = PropTypes.shape(theme);
  themeShape.themeKeys = Object.keys(theme);

  return themeShape;
}
```

I have created  [React feature request](https://github.com/facebook/react/issues/8310) to fill name attribute for all *propTypes*.
If it is approved - *ThemeProp* will be removed.

## Theme className example

For better experience suggest to use [classnames](https://www.npmjs.com/package/classnames) library.

* Define component theme structure

```js
import { ThemeProp } from 'forgekit';

import classnames from 'classnames';
import buttonStyles from './style.css';

const Button = ({theme, children, className, ...props}) => {
  const classList = classnames(className, theme.base, theme.design);
  return <button className={classList} {...props}>{children}<button/>
};

Button.propTypes = {
  theme: ThemeProp({
    // "base" determine default button rules such as cursor, white-space, overflow, align etc.
    base: PropTypes.string,
    // "design" determine how button looks
    design: PropTypes.string,
  }),
};

Button.defaultProps = {
  theme: {
    base: buttonStyles.base,
  },
};
```

* Define feature theme structure

```js
import styles from './alert.css';

const Alert = ({alert, className, ...props}) => {
  return {
    ...props,
    className: classnames(className, {
      theme.alert: alert
    });
  }
};

Alert.propTypes = {
  theme: TemeProp({
    alert: PropTypes.string
  })
};

Alert.defaultprops = {
  theme: {
    alert: syles.alert
  }
};
```

* Override theme values while forging

```js
import materialButtonStyles from './material-button.css';

const MaterialButton = fogrkit(Alert)(Button, 'MaterialButton', {
  theme: {
    // could override any default theme
    design: materialButtonStyles.materialButton,
    alert: materialButtonStyles.materialAlert
  }
});
```

* Or Forge and use theme prop

```js
import materialButtonStyles from './material-button.css';

const MeterialComponent = fogrkit(Alert)(Button);

const theme = {
  design: materialButtonStyles.materialButton,
  alert: materialButtonStyles.materialAlert
};

<MaterialButton theme={theme}>Hello</MaterialButton>
```


## Theme styles example

It is same as example with classNames expect:

* *Object.assign* or [object spread](https://github.com/sebmarkbage/ecmascript-rest-spread) instead of *classnames*
* Define props as *PropTypes.object* or even *PropTypes.shape({...})*  instead of *PropTypes.string*

```js
import { ThemeProp } from 'forgekit';

import classnames from 'classnames';

const buttonStyles = {
  base: {
    position: 'relative',
    overflow: 'hidden',
    // ...
  }
};

const Button = ({theme, children, style, ...props}) => {
  const completeStyle = {
    ...style,
    ...theme.base,
    ...theme.design
  };

  return <button style={completeStyle} {...props}>{children}<button/>
};

Button.propTypes = {
  theme: ThemeProp({
    // "base" determine default button rules such as cursor, white-space, overflow, align etc.
    base: PropTypes.object,
    // "design" determine how button looks
    design: PropTypes.object,
  }),
};

Button.defaultProps = {
  theme: {
    base: buttonStyles.base,
  },
};
```
