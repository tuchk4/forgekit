# Forgekit and Recompose

- [Differences](#differences)
    - [Forgekit features provide its own propTypes and defaultProps](#forgekit-features-provide-its-own-proptypes-and-defaultprops)
    - [Forgekit merge propTypes and defaultProps](#forgekit-merge-proptypes-and-defaultprops)
    - [Forgekit provide tools for component and feature theming](#forgekit-provide-tools-for-component-and-feature-theming)
    - [Display name](#display-name)
- [Example of same feature with Forgekit and Recompose](#example-of-same-feature-with-forgekit-and-recompose)
- [Example of same lifecycle feature with Forgekit and Recompose](#example-of-same-lifecycle-feature-with-forgekit-and-recompose)
- [Example of same ref feature with Forgekit and Recompose](#example-of-same-ref-feature-with-forgekit-and-recompose)
- [Forgekit and Recompose can work together](#forgekit-and-recompose-can-work-together)
- [Perfomance tests](#perfomance-tests)
- [Feedback wanted](#feedback-wanted)

As the developer of the Forgekit I am not happy to develop one more library (one more npm package).
At least because most forgekit features could be implemented with:

* [recompose/mapProps](https://github.com/acdlite/recompose/blob/master/docs/API.md#mapprops)
* [recompose/withProps](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)
* [recompose/setDisplayName](https://github.com/acdlite/recompose/blob/master/docs/API.md#setdisplayname)
* [recompose/lifecycle](https://github.com/acdlite/recompose/blob/master/docs/API.md#lifecycle)

## Differences

#### Forgekit features provide its own propTypes and defaultProps

Forgekit suggest to develop and store features separately from components. Forgekit feature is a pure functions that:

* provide *propTypes* and *defaultProps*
* takes props as argument and returns new props
* provide its own theme structure ([more about themes](./theme.md))

There are a lot of advantages:

* Responsibility. Each feature stored at separated file (or module if speak in CommonJS context) and there is code that implements only specific functionality and provide its own *propsTypes*.
* Sharable. Features could be shared between components or applications. And don't even depends on components library. It could work above it.
* Refactoring. It is more simpler to remove feature import than find and remove large number of related lines of code.
* Refactoring. Old feature can be swapped with new features. So *propTypes* and *defaultProps* also will be swapped.

More details at [features api documentation](./feature.md);

#### Forgekit merge propTypes and defaultProps

This is important. And this is the critical difference for our development flow.
We use[
React storybook
](https://github.com/storybooks/react-storybook)
with [storybook info addon](https://github.com/storybooks/react-storybook-addon-info) so it is important to collect all available *propTypes* and show them in the docs.

But anyway propTypes merging can be implemented with higher order function for *recompose*.

For example (note that this is pseudocode):

```js
const Feature = mapProps(() => {});
Feature.propTypes = {...};

const enchantedCompose = (...features) => {
  let propTypes = {};

  features.map(feature => {
    propTypes = {
      ...propTypes,
      ...feature.propTypes
    }
  });
  return Component => {
    const EnchantedComponent = compose(...features)(Component);
    EnchantedComponent.propTypes = propTypes;
    EnchantedComponent.defaultProps = defaultProps;

    return EnchantedComponent;
  }
}

enchantedCompose(Feature)(Component);
```

And that is why I am hot happy to develop one more very similar library. Feedback is very wanted. Write me on twitter [@tuchk4](https://twitter.com/tuchk4) or create [Issue](https://github.com/tuchk4/forgekit/issues/new).f there are some ideas.

#### Forgekit provide tools for component and feature theming

Allows to define theme structure for feature or component. It is used for *classNames* or *style* calculating.
Support custom themes provided by global CSS or inline styles and other libraries:

* [CSS Modules](https://github.com/css-modules/css-modules)
* [Aphrodite](https://github.com/Khan/aphrodite)
* [Radium](http://formidable.com/open-source/radium/)
* [React Style](https://github.com/js-next/react-style)
* [JSS](https://github.com/cssinjs/jss)

More details at <a href="./theme.md">theme documentation</a>.

#### Display name

From my point of view - Forgekit provides more readable *displayName*.
Display name is useful for generating error messages and for [React chrome developers tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en).

* Forgekit

```html
<MaterialButton> ...
```

* Recompose

```html
<mapProps(mapProps(MaterialButton))> ...
```

---

## Example of same feature with Forgekit and Recompose

* Forgekit:

```js
import forgekit from 'forgekit';

const AlertIcon = ({
  alert,
  icon,
  ...props
}) => ({
  ...props,  
  alert,
  icon: !icon && alert ? 'alert' : ''
});

const ForgedComponent = forge(AlertIcon)(Component, 'AlertComponent', props => {
  return {
    onClick: (e) => {
      if (props.alert) {
        console.warning('alert button clicked');
      }

      if (props.onClick) {
        onClick(e);
      }
    }
  }
});
```

* Recompose:

```js
import mapProps from 'recompose/mapProps';
import setDisplayName from 'recompose/setDisplayName';
import withProps from 'recompose/withProps';
import compose from 'recompose/compose'

const AlertIcon = mapProps({
  alert,
  icon,
  ...props
}) => ({
  ...props,  
  alert,
  icon: !icon && alert ? 'alert' : ''
});

const EnchantedComponent = compose(
  AlertIcon,
  withProps(props => {
    return {
      onClick: (e) => {
        if (props.alert) {
          console.warning('alert button clicked');
        }

        if (props.onClick) {
          onClick(e);
        }
      }
    }
  }),
  setDisplayName('AlertComponent')
)(Component);
```

## Example of same lifecycle feature with Forgekit and Recompose

* Forgekit:

```js
import forgekit from 'forgeit';

class Hoc extends React.Component {
  componentDidMount() {
    console.log(ReactDOM.findDOMNode(this));
  }
}

const Feature = {
  hoc: props => Component => {
    return (
      <Hoc>
        <Component {...props}/>
      </Hoc>
    );
  }
}
export default forgekit(Feature)(Component);
```

* Recompose:

```js
import lifecycle from 'recompose/lifecycle';
import compose from 'recompose/compose'

export default compose(
  lifecycle({
    componentDidMount() {
      console.log(ReactDOM.findDOMNode(this));
    }
  })
)(Component);
```


## Example of same ref feature with Forgekit and Recompose

* Forgekit:

```js
import forgekit from 'forgeit';

forgekit(props => {
  return {
    ...props,
    children: <span ref={(e) => console.log(e)}>{props.children}</span>
  }
})(Component);
```

* Recompose:

```js
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose'

const EnchantedComponent = compose(
  mapProps(props => {
    return {
      ...props,
      children: <span ref={(e) => console.log(e)}>{props.children}</span>
    }
  })
)(Component);
```

## Forgekit and Recompose can work together

```js
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withContext from 'recompose/withContext';

import forgekit from 'forgekit';

const ForgedComponent = (...features)(Component);

export default compose(
  pure(),
  withContext({
    childContextTypes: {},
    getChildContext: prop => {}
  })
)(ForgedComponent);
```



## Perfomance tests

Tested components:

* [Forgekit component gist](https://gist.github.com/tuchk4/53372534b08d778f41223588b9cb3b82)
* [Recompose component gist](https://gist.github.com/tuchk4/d9b2ae886e98006a6ac285e89e8fa4eb)

Tested 20k renders. Used [React perf addon](https://facebook.github.io/react/docs/perf.html)

**Forgkit**

* console.time between *constructor* -> *componentDidMount* time ~ 5.08sec

| (index)  | Owner > Component           | Inclusive render time (ms) | Instance count | Render count |
|----------|-----------------------------|----------------------------|----------------|--------------|
| 0        | "App"                       | 985.01                     | 1              | 1            |
| 1        | "App > Perfomance"          | 984.87                     | 1              | 1            |
| 3        | "Perfomance > Button"       | 148.52                     | 20000          | 20000        |
| 2        | "Perfomance > ForgedButton" | 725.21                     | 20000          | 20000        |

**Recompose**

* console.time between *constructor* -> *componentDidMount* time ~ 4.78sec

| (index)  | Owner > Component                                                | Inclusive render time (ms) | Instance count | Render count |
|----------|------------------------------------------------------------------|----------------------------|----------------|--------------|
| 0        | "App"                                                            | 620.29                     |1               | 1            |
| 1        | "App > Perfomance"                                               | 620.14                     |1               | 1            |  
| 2        | "Perfomance > defaultProps(mapProps(mapProps(EnchantedButotn)))"	| 476.35                     |20000	          | 20000        |

So Recompose a bit faster.

**But Forgekit allows to write more standalone features**. Each feature provide its own *propTypes* and *defaultProps*.

For example Forgekit *icon.js* provide [propTypes and defaultProps](https://gist.github.com/tuchk4/53372534b08d778f41223588b9cb3b82#file-icon-js-L28);

With recompose we should define *defaultProps* [while composing](https://gist.github.com/tuchk4/d9b2ae886e98006a6ac285e89e8fa4eb#file-recompose-button-js-L18).
This break modules responsibility.
Also will hard to share features between components or application because default values are defined outside of *mapProps* implementation.


## Feedback wanted

Forgekit is still in the early stages and even still be an experimental project. Your are welcome to submit issue or PR if you have suggestions! Or write me on twitter [@tuchk4](https://twitter.com/tuchk4).
