# Forgekit vs Recompose

As the developer of the Forgekit I am really not happy to develop one more library (one more npm package).
At least because most forgekit features could be implemented with:

* [recompose/mapProps](https://github.com/acdlite/recompose/blob/master/docs/API.md#mapprops)
* [recompose/withProps](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)
* [recompose/setDisplayName](https://github.com/acdlite/recompose/blob/master/docs/API.md#setdisplayname)
* [recompose/lifecycle](https://github.com/acdlite/recompose/blob/master/docs/API.md#lifecycle)

*But* there some critical differences:

* Forgekit merge propTypes and defaultProps
* Forgekit provide tools for component theming
* From my point of view - Forgekit provides more readable *displayName*
*


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

const ForgedComponent = forge(AlertIcon)(Component);
```

* Recompose mapProps:

```js
import mapProps from 'recompose/mapProps';
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

const EnchantedComponent = compose(AlertIcon)(Component);
```

The differences:

> NOTE: I am not sure about some statements about recompose

* If manipulate only with existing component's props - there are no differences expect that mapProps returns higher order component. Forgekit feature provide function that is just executed before component's render.

* If see such functions as new component's feature - Forgekit merge all propTypes and defaultProps from all features and origin component.
Recompose does not manipulate with propTypes and defaultProps.

* From my point of view - Forgekit provides more readable displayName.

* Forgekit feature could be defiened with its own propTyps and theme.

* Rendering perfomance: recompose a bit faster  (But I dont understand why). Rendering 50k components with recompose: 2.1sec, with Forgekit: 2.8sec.

## Forgekit and Recompose can work together

```js
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withContext from 'recompose/withContext';

import forgekit from 'forgekit';

const ForgedComponent = (...features)(Component);

export default compose(
  pure(),
  withContext()
)(ForgedComponent);
```

## Trouble shooting
## Difference in lifecycle methods? ref?
