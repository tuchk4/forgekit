# Feature examples

* [Feature documentation](./feature.md)
* [Forgekit api documentation](./api.md)

More examples are at  Forgekit components library. I will contribute it a lot:

* Develop all base components and features for them
* Add styles according to Google Material design
* Components should be easily stylized to any other design without extra styles at application build

##### Common features that could be added to any component

* *Ripple* - Component will have a ripple effect on click. [Example implementation](#ripple)
* *HighliteFlags* - Depends on prop *primary* / *alert* / *danger* / *warning* - add styles to the component. [Example implementation](#highliteflags)
* *LoadingOverlay* - If *loading* prop is true - show loader overlay above the component.
* *ClickOutside* - Fires when click outside of the component. [Example implementation](#clickoutside)
* *Sticky* - add fixed position to element. Could be configured (min and max y).
* *Permissions* - Provide permission config. Specific for application.

##### `<Button/>`

* *ClickValue* - Pass *clickValue* prop that will be passed to *onClick* as first argument. This helps to prevent *fn.bind* usage. [Example implementation](#clickvalue)

##### `<Multiselect/>` or `<Select/>`

* *FilterOptions* - add *source* prop that allows to load items only when `<Multiselect/>` is opened.
* *Overlay* - add body overlay that prevent any click or scroll events if `<Multiselect/>` is opened. Click outside of `<Multiselect/>` will only close it and do not trigger any other event.
* *FilterOptions* - Add text input to filter options.

##### `<Dialog/>`

* *clickOutsideToClose* - Close dialog if click outside
* *onEscKeyDown* - Fired when dialog is opened and *esc* key is pressed

##### `<Form/>`

* *validation* - Provide custom validation rules

#### `<List/>`

* *seletable* - The elements in the list will display a hover effect and a pointer cursor. Support arrow keys click events.
* *actions* - A list of elements that are placed to the list item.
* *grouped* - Render list items groups.
* *collapsable* - Collapse list items groups. Alos provide *onCollapse* callback prop.

and so on and so on :tada:

# Feature example implementation

#### Ripple

```js
const Ripple = ({children}) => {};
const RippleFeature = ({ children, ...props}) => {

  return {
    ...props,
    children: (
      /**
       * If such way broke markup - it also could be implemented via hoc and ref.
       */
      <Ripple>
        {children}
      </Ripple>
    )
  }
};

RippleFeature.propTypes = {
  ripple: PropTypes.bool
};
```

#### HighliteFlags

More about theme and *ThemeProp* at [theme documentation](./theme.md);

```js
import styles from './highlite-flags.css';
import classnames from 'classnames';

const HighliteFlags = ({
  alert,
  warning,
  success,
  className,
  theme,
  ...props,
}) => {
  return {
    ...props,
    className: classnames(className, {
      [theme.alert]: alert,
      [theme.warning]: warning,
      [theme.success]: success,
    }),
  };
};

HighliteFlags.propTypes = {
  alert: PropTypes.bool,
  warning: PropTypes.bool,
  success: PropTypes.bool,
  theme: ThemeProp({
    alert: PropTypes.string,
    warning: PropTypes.string,
    success: PropTypes.string,
  }),
};

HighliteFlags.defaultProps = {
  alert: false,
  warning: false,
  success: false,
  theme: {
    alert: styles.alert,
    warning: styles.warning,
    success: styles.success,
  },
};
```

#### ClickValue

```js
const ClickValueFeature = ({
  clickValue,
  onClick = () => {},
  ...props
}) => ({
  ...props,
  onClick: e => onClick(clickValue, e),
});

ClickValueFeature.propTypes = {
  clickValue: PropTypes.any,
  onClick: PropTypes.func,
};
```

#### ClickOutside

```js
let isDocumentListenerExists = false;
const handlers = {};

const onDocumentClick = e => {
  for (const target of Object.keys(handlers)) {
    if (target === e.target && e.target === window ||
      (document.documentElement.contains(e.target) && !DOMUtils.isDescendant(target, e.target))) {
      onClickOutside();

      handlers[target](e);
    }
  }
};

const handleClickOutside = (target, onClickOutside) => {
  handlers[target] = onClickOutside;

  if (!isDocumentListenerExists) {
    document.addEventListener('click', onDocumentClick, true);
    isDocumentListenerExists = true;
  }

  return () => {
    document.removeEventListener('click', onDocumentClick, true);
    if (!handlers.length) {
      isDocumentListenerExists = false;
    }
  };
};

class ClickOutside extends React.Component {
  disableClickOutside = null;

  componentDidMount() {
    handleClickOutside(findDOMNode(this), () => {
      this.disableClickOutside = this.props.onClickOutside();
    });
  }

  componentWillUnmount() {
    if (this.disableClickOutside) {
      this.this.disableClickOutside();
    }
  }

  render() {
    return this.props.children;
  }
};

const ClickOutsideFeature =  {
  hoc: (Component) => {
    return ({
      onClickOutsideEnabled,
      onClickOutside,
      ...props
    }) =>
      if (!onClickOutside || !onClickOutsideEnabled) {
        return <Component {...props}/>;
      }

      return (
        <ClickOutside onClickOutside={onClickOutside}>
          <Component {...props} />
        </ClickOutside>
      );
    }
  }
};

ClickOutsideFeature.propTypes = {
  onClickOutside: PropTypes.func,
  onClickOutsideEnabled: PropTypes.bool,
};

ClickOutsideFeature.defaultProps = {
  onClickOutsideEnabled: true
};
```
