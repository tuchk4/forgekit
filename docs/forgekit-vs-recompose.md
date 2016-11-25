# Forgekit vs Recompose

All forgekit features (which are without lifecycle methods) could be implemented with *recompose/mapProps*.
Pure features are

```js
const AlertIcon = ({
  alert,
  icon,
  ...props
}) => ({
  ...props,  
  alert,
  icon: !icon && alert ? 'alert' : ''
})
```

```js
import mapProps from 'recompose/mapProps';

const AlertIcon = mapProps({
  alert,
  icon,
  ...props
}) => ({
  ...props,  
  alert,
  icon: !icon && alert ? 'alert' : ''
})
```

The differences:

> NOTE: I am not sure about some statements about recompose

* If manipulate only with existing component's props - there are no differences expect that mapProps returns higher order component. Forgekit feature provide function that is just executed before component's render.

* If see such functions as new component's feature - Forgekit merge all propTypes and defaultProps from all features and origin component.
Recompose does not manipulate with propTypes and defaultProps.

* From my point of view - Forgekit provides more readable displayName.

* Forgekit feature could be defiened with its own propTyps and theme.

* Rendering perfomance: recompose a bit faster  (But I dont understand why). Rendering 50k components with recompose: 2.1sec, with Forgekit: 2.8sec.

## Forgekit and Recompose

Two libraries could work together

```js
const ForgedComponent = (f1, f2, f3)(Button, 'IconButton', {
  theme: {},
  icon: 'alert',
  iconPosition: 'left'
});

export default compose(
  pure(),
  withContext()
)(ForgedComponent);
```


## What should I use?

## Difference in lifecycle methods? ref?
