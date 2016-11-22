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

Function definition is useful when need to define props that depends on another props:

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
