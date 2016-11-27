# <a href="https://github.com/tuchk4/forgekit"><img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/logo/forgekit-logo-small.png"></a>

![Forgekit travis build](https://api.travis-ci.org/tuchk4/forgekit.svg?branch=master)

**This project is still experimental, so feedback from component authors would be greatly appreciated!**

## Motivation

[recompose](https://github.com/acdlite/recompose) had a great influence. It is great library that provide excellent way to lift state into functional wrappers, perform the most common React patterns, optimize rendering performance. Also it is possible to store common functions separately and share them between components. And as the result - component's source code become much more easier.

> recompose - React utility belt for function components and higher-order components. Think of it like lodash for React.

## Forgekit

Provide easier way to develop component's features and inject them into the components.

### Little theory. What is component feature?

It is an intentional distinguishing characteristic of a component. In most cases each component feature provide new specific *propTypes*.

And there **Low-level** prop types and **high-level** prop types.
From React documentation - [DOM Elements](https://facebook.github.io/react/docs/dom-elements.html):

> React implements a browser-independent DOM system for performance and cross-browser compatibility. We took the opportunity to clean up a few rough edges in browser DOM implementations.
In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute tabindex corresponds to the attribute tabIndex in React. The exception is aria-* and data-* attributes, which should be lowercased.

So all DOM attributes and *children* prop are **low-level** component props.
**High-level props** - are custom props.

And in all cases **high-level** props always affects on **low-level** props. That why it is better to map component props before *render* instead of creating higher order components.

It is looks like props middlewares (or like props micro services :tada:). This way does not generate higher order components so it will not affect on performance.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/props-as-middleware.png">

Feature function signature:

```js
Feature = function(props): newProps
Feature.propTypes = {}
Feature.defaultProps = {}
```

Inject features into the component:

```js
import forgekit from 'forgekit';

const Button = (children, ...props) => <button {...props}>{children}</button>;
const ForgedButton = forgekit(Feature1, Feature2)(Button);
```

ForgedButton *propTypes* and *defaultProps* are merged from all features and origin component:

```js
ForgedButton.propTypes = {
  ...Button.propTypes,
  ...Feature1.propTypes,
  ...Feature2.propTypes
}

ForgedButton.defaultProps = {
  ...Button.defaultProps,
  ...Feature1.defaultProps,
  ...Feature2.defaultProps
}
```

So if you use [React Sotrybook](https://github.com/storybooks/react-storybook) with [storybook-addon-ifno](https://github.com/storybooks/react-storybook-addon-info) - it will show components props and default props correctly.

## Forgekit api

```js
forge(...features)(Component, displayName, withProps)
```

* *features* - Injected features
* *Component* - Original component
* *displayName* - New component's display name. Works correctly with [Chrome developers tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* *withProps* - Defined props that are merged with component's props before features execution. Could be used as object and as function.

If object:

```js
const features = forge(...features)
export default features(Component, 'Button');
export const RippleButton = features(Component, 'RippleButton', {
  ripple: true
});
```

Function definition is useful when need to define props that depends on another props.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/props-as-middleware-with-props.png">

```js
export default forge(...features)(Component, 'Button', ({
  alert,
  ...props
}) => {

  return {
    ...props,
    // Add "error" icon if "alert" prop exists
    icon: alert ? 'error' : ''
  }
});
```


It is easier and much more readable than create higher order components for such features or add such simple logic inside component.

## Forgekit theme api

Supporting css modules.
```js
import { ThemeProp } from 'forgekit';
import styles from './style.css';

const AwesomeComponent = ({theme, children}) => {
  const classList = classnames(theme.base, theme.style);
  return <div className={classList}>{children}<div/>
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

```

```js
import { ThemeProp } from 'forgekit';
import styles from './style.css';

const whiteFrame = ({className, z, theme, ...props}) => {
  return {
    ...props,
    className: classnames(className, {
      [theme.whiteframe]: z
      [`${styles.whiteframe}-${z}dp`]: z
    })
  }
}

whiteFrame.propTypes = {
  z: PropTypes.number,
  theme: ThemeProp({
    whiteframe: PropTypes.string,
  })
}

whiteFrame.defaultProps = {
  z: 0,
  theme: {
    whiteframe: styles.whiteframe
  }
}
```

All theme keys will be merged in ForgedComponent

```js
const ForgedComponent = forgekit(whiteFrame)(AwesomeComponent);
expect(ForgedComponent.propTypes).toEqual({
  theme: {
    whiteframe: PropTypes.string,,
    base: PropTypes.string,
    style: PropTypes.string
  }
})
```

Customize theme properties:
```js
import customStyles from './custom-styles.css';

const ForgedComponent = forgekit(whiteFrame)(AwesomeComponent, 'ForgedComponent', {
  theme: {
    whiteframe: customStyles.whiteFrame
  }
});
```

or event dynamic customization
```js
import customStyles from './custom-styles.css';

const ForgedComponent = forgekit(whiteFrame)(AwesomeComponent, 'ForgedComponent', (props) => {
  return {
    theme: {
      whiteframe: props.alert ? customStyles.alertWhiteFrame : customStyles.whiteFrame
    }
  }
});
```

### Feature examples

For example there is a *<Button/>* component with new high-level props:

* *alert: PropTypes.bool* - If true, component will have an alert styles
* *icon: PropTypes.bool* - Value of the icon (See Font Icon Component).
* *iconPosition: PropTypes.oneOf(['left', 'right'])* - Show icon form the left of right from label
* *flat* - If true, the button will have a flat look.

Let's define relations between high-level and low-level props

* *alert* - affects *style* or *className*. The same behaviour is for *flat* property.

```js
const alertFeature = ({
  alert,
  style,
  ...props
}) => {
  const alertStyles = alert ? {
    color: 'red'
  } : {};

  return {
    ...props,
    style: {
      ...(style || {}),
      ...alertStyles
    }
  }
};

alertFeature.propTypes = {
  alert: PropTypes.bool
}
```

* *icon* - also affects *children*. Depending on *iconPosition* add *<Icon/>* to the *children*.

```js
const iconFeature = ({
  icon,
  iconPosition,
  children,
  ...props
}) => {

  return {
    ...props,
    children: [
      iconPosition == 'left' ? renderIcon(icon) : null,
      children,
      iconPosition == 'right' ? renderIcon(icon) : null,
    ]
  }
}

iconFeature.propTypes = {
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
}
```

## Develop features with lifecycle methods

For example it is not possible to implement *clickOutside* feature if there is not access to lifecycle methods. To implement this feature:

* On *componentDidMount* - enable click outside listener
* On *componentWillUnmount* - remove listener
* get access to component's DOM element

This is possible with forgekit. Just define Feature as object:

```js
class ClickOutside extends React.Component {
  componentDidMount() {
    // ...
  }

  componentWillUnmount() {
    // ...
  }

  render() {
    return this.props.children;
  }
}

const Feature = {
  hoc: Component => {
    return ({
      onClickOutside,
      ...props
    }) =>
      return (
        <ClickOutside onClickOutside={onClickOutside}>
          <Component {...props} />
        </ClickOutside>
      );
    }
  }
}
```

### Forgekit advantages

### ...share common features between components

There are features that does not relate to certain component. They could be injected into any component.

* *clickOutside* - Fires after click outside of the component
* *highlite flags* - Depends on flag (primary / alert / danger / warning) add styles to the component
* *loader overlay* - If *loading* prop is true - show loader overlay above the component

```js
import forgekit from 'forgekit';

import Button from 'components/button';
import Layout from 'components/layout';

import clickOutside from 'features/click-outside';
import loaderOverlay from 'features/loader-overlay';
import highliteFlags from 'features/highlite-flags';

export const AppButton = forgekit(clickOutside, highliteFlags)(Button);
export const AppLayout = forgekit(clickOutside, loaderOverlay)(Layout);
```

There is one common feature - *clickOutside*.
Forged components *<AppButton/>* and *<AppLayout/>* accepts *onClickOutside()* prop.
But *onClickOutside()* does not duplicated *propTypes* at the *<Button/>* and *<Layout/>*. It is injected by *clickOutside* feature.

* Feature could be used for few components. So no code duplication.

### ...use only needed features

Is look at any open source components library - each component has a lot of features so there are a lot of *PropTypes*. For example component *<Button/>* has features:

* *ripple* - If true, component will have a ripple effect on click.
* *icon* - Value of the icon (See Font Icon Component).
* *flat* - If true, the button will have a flat look.
* *raised* - If true, the button will have a flat look.
* *onMouseLeave* - 	Fires after the mouse leaves the Component.
* *inverse* - If true, the neutral colors are inverted. Useful to put a button over a dark background.

A lot of more. And it is not possible to use only *icon* feature. All features will be included to application build.

```js
import forgekit from 'forgekit';

import Button from 'components/button';

import icon from 'button/features/icon';
import ripple from 'button/features/ripple';

export default forgekit(icon, ripple)(Button);
```

* No extra code at app build because you load only base component and forge it with needed features.

### ...easier to refactor and support clean code

All needed features could be imported from separated modules. This is very helpful when you want to share your component's features with another team in your company or just push them to Github.
Also this provide good way to keep your code cleaner: just create new module and develop new functionality instead of patching existing modules (module - i mean commonJS module). And same with refactoring - just remove imports if need to clean some old or unused features. This is much easier than remove lines that relays to certain feature from all component's source (and there are great chance that other feature will become broken).

* Easy to remove features — just remove feature import. Instead of removing number of lines from the component.
* Easy to write and understand code — feature is a simple function
* Code responsibility. Each feature — separated module and there is no extra code. Only feature implementation. Very boost code reading and understanding.

### ...feature customization

Each feature could be customized. Very similar with Redux middleware customization.

```js
import fogekit from 'forgekit';

import icon from 'features/icon';
import highliteFlags from 'features/highlite-flags';

const Button = (children, ...props) => <button {...props}>{children}</button>;

const customFlags = highliteFlags({
  alert: {
    color: 'white',
    fontWeight: 'bold'
    background: 'red'
  }
});

export default forge(icon, customFlags)(Button);
```

### ...sharing features in open source

If there is any open source component's library that was built with Forgekit - it is simple to contribute because developers does not need to understand its whole structure and work with all library. Just develop feature function with tests and push it. Or even push to own repository.

## Install

```bash
npm install --save forgekit
```

## Forgekit components library

I will contribute to Forgekit components library:

* Develop all base components and features for them
* Add styles according to Google Material design
* Thanks Frogekit theme feature - components could be stylized to an other design

## Nearest feature plans

Create Forgekit react storybook plugin:

* Show used features
* Show available features
* Show component and features documentation


## Feedback wanted

Forgekit is still in the early stages and even still be an experimental project. Your are welcome to submit issue or PR if you have suggestions! Or write me on [Twitter](https://twitter.com/tuchk4) (Valerii Sorokobatko).

:tada:
