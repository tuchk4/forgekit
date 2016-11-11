import React, { PropTypes } from 'react';
import renderer from 'react-test-renderer';

import forge, { ThemeProp } from '../lib';

// original component
import Button from './components/button';

// features
import icon from './components/button/features/icon';
import clickValue from './components/button/features/click-value';
import highlightFlags from './components/features/highlite-flags';

describe('Forge components with features', () => {
  it('Should call feature functions in correct order', () => {
    const order = [];
    const featureMock1 = jest.fn(() => {
      order.push('mock1');
      return {};
    });

    const featureMock2 = jest.fn(() => {
      order.push('mock2');
      return {};
    });

    const featureMock3 = jest.fn(() => {
      order.push('mock3');
      return {};
    });

    const features = forge(featureMock1, featureMock2, featureMock3);

    const FeaturesButton = features(Button);

    renderer.create(<FeaturesButton />);

    /**
     * Features are called as they defined at forge.
     * At this test: featureMock1 -> featureMock2 -> featureMock3
     * Imagine that features - are like midelwares for component props.
     */
    expect(order).toEqual(['mock1', 'mock2', 'mock3']);
  });

  it('Should should merge component propTypes with features propTypes', () => {
    const features = forge(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button);

    /**
     * Froged Component propTypes and defaultProps
     * are the set of all propTypes from original Component and all fetures
     *
     * Should compare only keys beacse of closures such as PropTypes.shape
     */
    const expectedKeys = Object.keys({
      ...Button.propTypes,
      ...icon.propTypes,
      ...clickValue.propTypes,
      ...highlightFlags.propTypes,
    });

    // remove "theme" key becasue it is last prop. See collec-props.js:74
    expectedKeys.splice(expectedKeys.indexOf('theme'), 1);

    expect(Object.keys(FeaturesButton.propTypes)).toEqual([
      ...expectedKeys,
      // "theme" prop is alwasy last becasue of collec-props.js:74
      'theme',
    ]);
  });

  it('Should set displayName correctly', () => {
    const features = forge(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button, 'NewFeaturedButton');

    // Hope all is clear here :)
    expect(FeaturesButton.displayName).toEqual('NewFeaturedButton');
  });

  it('Should merge defaultProps', () => {
    const features = forge(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button);

    // Same as for propTypes. Described a bit above
    expect(FeaturesButton.defaultProps).toEqual({
      ...Button.defaultProps,
      ...icon.defaultProps,
      ...clickValue.defaultProps,
      ...highlightFlags.defaultProps,
    });
  });

  it('Should pass converted properties to each next feature', () => {
    const featureMock1 = jest.fn((props) => {
      return {
        mock1Foo: props.foo,
        mock1Bar: props.bar,
        foo: props.foo + 1,
        bar: props.bar + 1,
      };
    });

    const featureMock2 = jest.fn(props => ({
      mock2Foo: props.foo,
      mock2Bar: props.bar,
      foo: props.foo + 1,
      bar: props.bar + 1,
    }));

    const featureMock3 = jest.fn(props => ({
      mock3Foo: props.foo,
      mock3Bar: props.bar,
      foo: props.foo + 1,
      bar: props.bar + 1,
    }));

    const features = forge(featureMock1, featureMock2, featureMock3);

    const FeaturesButton = features(Button);

    const initialProps = {
      foo: 1,
      bar: '1',
    };

    const component = renderer.create(<FeaturesButton {...initialProps} />);
    const tree = component.toJSON();

    // Expect result component props
    expect(tree.props).toEqual({
      ...FeaturesButton.defaultProps,
      /**
       * Beacase intial value equals 1
       * Each feature returns "foo: props.foo + 1"
       * There are 3 features.
       * So 1 + (1 + 1 + 1) = 4;
       */
      foo: 4,
      /**
       * Same as for "foo" prop but for string
       */
      bar: '1111',
      /**
       * Beacuse mock3Foo and mock3Bar are returned from last feature (featureMock3)
       * There are no mock2Foo / mock2Bar / mock1Bar / mock1bar props becasue
       * featureMock3 doest no return them
       */
      mock3Foo: 3,
      mock3Bar: '111',
    });

    // Expect feautre calls and arguments (props);
    expect(featureMock1.mock.calls[0][0]).toEqual({
      ...FeaturesButton.defaultProps,
      /**
       * foo and bar should equals to component initialProps
       */
      foo: 1,
      bar: '1',
    });

    expect(featureMock2.mock.calls[0][0]).toEqual({
      foo: 2,
      bar: '11',

      /**
       * mock1Foo and mock1Bar were returned by featureMock1
       * featureMock1 was called before featureMock1
       */
      mock1Foo: 1,
      mock1Bar: '1',
    });

    expect(featureMock3.mock.calls[0][0]).toEqual({
      foo: 3,
      bar: '111',

      /**
       * mock2Foo and mock2Bar were returned by featureMock2
       * featureMock2 was called before featureMock3
       */
      mock2Foo: 2,
      mock2Bar: '11',
    });
  });

  it('Should override propeties', () => {
    const AwesomeComponent = jest.fn(() => <div>Hello</div>);
    AwesomeComponent.propTypes = {
      foo: PropTypes.string,
      theme: ThemeProp({
        base: PropTypes.string,
      }),
    };

    AwesomeComponent.defaultProps = {
      foo: 'defaultFoo',
      theme: {
        base: 'base',
      },
    };

    const feature = props => ({ ...props });
    const ForgedComponent1 = forge(feature)(AwesomeComponent, 'AwesomeComponent', {
      foo: 'overridenFoo',
      theme: {
        base: 'overridenBase',
      },
    });

    renderer.create(<ForgedComponent1 />);

    expect(AwesomeComponent.mock.calls[0][0]).toEqual({
      foo: 'overridenFoo',
      theme: {
        base: 'overridenBase',
      },
    });

    const ForgedComponent2 = forge(feature)(AwesomeComponent, 'AwesomeComponent', {
      foo: 'overridenFoo',
    });

    renderer.create(<ForgedComponent2 />);

    expect(AwesomeComponent.mock.calls[1][0]).toEqual({
      foo: 'overridenFoo',
      theme: {
        base: 'base',
      },
    });
  });
});
