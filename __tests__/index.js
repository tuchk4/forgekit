import React from 'react';
import renderer from 'react-test-renderer';

import enchantWithFeatures from '../lib';

// original component
import Button from './components/button';

// features
import icon from './components/button/features/icon';
import clickValue from './components/button/features/click-value';
import highlightFlags from './components/features/highlite-flags';

describe('enchant components with features', () => {
  it('should call feature functions in correct order', () => {
    const order = [];
    const featureMock1 = jest.fn(() => {
      order.push('mock1');
    });

    const featureMock2 = jest.fn(() => {
      order.push('mock2');
    });

    const featureMock3 = jest.fn(() => {
      order.push('mock3');
    });

    const features = enchantWithFeatures(featureMock1, featureMock2, featureMock3);

    const FeaturesButton = features(Button);

    renderer.create(<FeaturesButton />);

    expect(order).toEqual(['mock1', 'mock2', 'mock3']);
  });

  it('should should merge component propTypes with features propTypes', () => {
    const features = enchantWithFeatures(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button);

    expect(FeaturesButton.propTypes).toEqual({
      ...Button.propTypes,
      ...icon.propTypes,
      ...clickValue.propTypes,
      ...highlightFlags.propTypes
    });
  });

  it('should set displayName correctly', () => {
    const features = enchantWithFeatures(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button, 'NewFeaturedButton');

    expect(FeaturesButton.displayName).toEqual('NewFeaturedButton');
  });

  it('should merge defaultProps', () => {
    const features = enchantWithFeatures(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button);

    expect(FeaturesButton.defaultProps).toEqual({
      ...Button.defaultProps,
      ...icon.defaultProps,
      ...clickValue.defaultProps,
      ...highlightFlags.defaultProps
    });
  });

  it('should pass converted properties to each next feature', () => {
    const featureMock1 = jest.fn(props => {
      return {
        mock1Foo: props.foo,
        mock1Bar: props.bar,
        foo: props.foo + 1,
        bar: props.bar + 1
      };
    });

    const featureMock2 = jest.fn(props => {
      return {
        mock2Foo: props.foo,
        mock2Bar: props.bar,
        foo: props.foo + 1,
        bar: props.bar + 1
      };
    });

    const featureMock3 = jest.fn(props => {
      return {
        mock3Foo: props.foo,
        mock3Bar: props.bar,
        foo: props.foo + 1,
        bar: props.bar + 1
      };
    });

    const features = enchantWithFeatures(featureMock1, featureMock2, featureMock3);

    const FeaturesButton = features(Button);

    const initialProps = {
      foo: 1,
      bar: '1'
    };

    const component = renderer.create(<FeaturesButton {...initialProps}/>);
    const tree = component.toJSON();

    expect(tree.props).toEqual({
      foo: 4,
      bar: '1111',
      mock3Foo: 3,
      mock3Bar: '111',
      ...FeaturesButton.defaultProps
    });

    expect(featureMock1.mock.calls[0][0]).toEqual({
      foo: 1,
      bar: '1',
      ...FeaturesButton.defaultProps
    });

    expect(featureMock2.mock.calls[0][0]).toEqual({
      foo: 2,
      bar: '11',
      mock1Foo: 1,
      mock1Bar: '1'
    });

    expect(featureMock3.mock.calls[0][0]).toEqual({
      foo: 3,
      bar: '111',
      mock2Foo: 2,
      mock2Bar: '11'
    });
  });
});
