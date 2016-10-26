# 1.1.0

* postForge - feature static property. Function that will be executed after all component's feature. Accept component props and should return new props.

Feature signature:
```js
Feature = function(props): newProps;
Feature.propTypes = {};
Feature.defautProps = {};
Feature.postForge = function(props): newProps;
```
