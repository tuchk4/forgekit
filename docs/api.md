## Forgekit api

<a href="./feature.md">Features and feature api documentation</a>

<img src="https://raw.githubusercontent.com/tuchk4/forgekit/release/2.0/docs/images/props-as-middleware.png">

```js
forge(...features)(Component, displayName, bindProps)
```

* **features** *Array[Function]* - Used features
* (required) **Component** *React.Component* - Original component
* **displayName** *String* - New component's display name. Works correctly with [Chrome developers tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* **bindProps** *Object | Function* - Props that are merged with the owner props. Instead of a function, you can also pass a props object directly. In this form props take precedence over props from the owner.

```js
const ForgedComponent = forge(feature1, feature2, feature3)(Component)
```

Same as

```js
const ForgedComponent = (props) => {
  const newProps = feature3(featur2(feature1(props)));
  return <Component {...newProps}/>;
}
```

### bindProps example

If **bindProps** is object:

```js
const features = forge(...features);
export default features(Component, 'Button');
export const RippleButton = features(Component, 'RippleButton', {
  ripple: true
});
```

If **bindProps** is Function. It is useful when need to define props that depends on another props:

```js
export default forge(...features)(Component, 'Button', ({
  alert,
  ...props
}) => ({
    ...props,
    icon: alert ? 'error' : '' // Add "error" icon if "alert" prop exists
  })
);
```

It is easier and much more readable to bind some props than create higher order components for such features or add such simple logic inside component.
