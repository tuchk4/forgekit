## Forgekit theme api

Allows to define feature or component theme structure and then process it into component's *classNames* or *style*.
Theme structure should be defined at the *propTypes*.
Default theme values should be defined at *defaultProps*.

All defined themes will be merged in the ForgedComponent.
Each feature or component will receive only defined theme structure.

```js
import { ThemeProp } from 'forgekit';

Feature1.propTypes = {
  theme: ThemeProp({
    feature1: PropTypes.string
  })
};

Feature2.propTypes = {
  theme: ThemeProp({
    feature2: PropTypes.string
  })
};

const ForgedComponent = forge(Feature1, Feature2)(Component);

expect(ForgedComponent.propTypes.theme).toEqual({
  ...Feature1.propTypes.theme,
  ...Feature2.propTypes.theme,
});
```

**What is the ThemeProp?**

It is same as *PropTypes.shape* but there is the static attribute that contains all defined attributes. Forgekit needs it for theme merging.

```js
const ThemeProp = theme => {
  const themeShape = PropTypes.shape(theme);
  themeShape.themeKeys = Object.keys(theme);

  return themeShape;
}
```

## className Example

For better experience suggest to use [classnames](https://www.npmjs.com/package/classnames) library.

* Define component's theme structure

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

* Define feature's theme structure

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

* Forge and use theme prop

```js
import materialButtonStyles from './material-button.css';

const MeterialComponent = fogrkit(Alert)(Button);

const theme = {
  design: materialButtonStyles.materialButton,
  alert: materialButtonStyles.materialAlert
};

<MaterialButton theme={theme}>Hello</MaterialButton>
```


## styles Example

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
