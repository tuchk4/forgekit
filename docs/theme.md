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
