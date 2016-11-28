## Forgekit api

In general it looks like props middleware.
But each feature also can implement a higher order component (usually for lifecycle methods).

**What is Feature**?

More details about features in <a href="./feature.md">features api documentation</a>.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/props-as-middleware.png">

```js
import forgekit from 'forgekit';

forge(...features)(Component, displayName, bindProps)
```

* **features** *Array[Function]* - Used features
* (required) **Component** *React.Component* - Original component
* **displayName** *String* - New component display name. Works correctly with [Chrome developers tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* **bindProps** *Object | Function* - Props that are merged with the owner props.

**It also can be read as**

```js
const ForgedComponent = forge(feature1, feature2, feature3)(Component);

//Same as
const ForgedComponent = props => {
  const newProps = feature3(featur2(feature1(props)));
  return <Component {...newProps}/>;
}
```

### bindProps as object

*bindProps* as *object* - take precedence over props from the owner.

```js
const features = forge(...features);
export default features(Component, 'Button');
export const RippleButton = features(Component, 'RippleButton', {
  ripple: true
});
```

### bindProps as function

*bindProps* as *function* is useful when need to define props that depends on another props.

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/props-as-middleware-with-props.png">

```js
export default forge(...features)(Component, 'AwesomeComponent', ({
  alert,
  ...props
}) => ({
    ...props,
    // Add "error" icon if "alert" prop exists
    icon: alert ? 'error' : ''
  })
);
```

It is easier and much more readable to bind some props in this way than create higher order components for such features or add such simple logic inside component.


## Feedback wanted

Forgekit is still in the early stages and even still be an experimental project. Your are welcome to submit issue or PR if you have suggestions! Or write me on twitter [@tuchk4](https://twitter.com/tuchk4).
