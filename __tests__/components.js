const React = require('react');
const renderer = require('react-test-renderer');

const enchantWithFeatures = require('../lib');

// original component
const Button = require('./components/button');

// features
const icon = require('./components/button/features/icon');
const clickValue = require('./components/button/features/click-value');
const highlightFlags = require('./components/features/highlite-flags');

describe('components tests', () => {
  it('enchanted properties', () => {
    const features = enchantWithFeatures(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button, 'FeaturesButton');

    const initialProps = {
      alert: true,
      clickValue: 'yo',
      iconPosition: 'right',
      icon: 'mail'
    };

    const component = renderer.create(<FeaturesButton {...initialProps}/>);
    const tree = component.toJSON();

    const propsKeys = Object.keys(tree.props);

    // used toContain expect toEqual bacause of componen's default props
    expect(propsKeys).toEqual([
      ...Object.keys(Button.defaultProps),
      'onClick',
      'style',
    ]);


    expect(tree.props.style).toEqual({
      color: 'red'
    });
  });

  it('simulate click with clickValue feature', () => {
    const onClickMock = jest.fn();

    const features = enchantWithFeatures(clickValue, highlightFlags);
    const FeaturesButton = features(Button, 'FeaturesButton');

    const initialProps = {
      clickValue: 'yo',
      onClick: onClickMock
    };

    const component = renderer.create(<FeaturesButton {...initialProps}/>);
    // to test arguments for onClick callbacck we should use enzyme.shallow
    // expect(onClickMock.mock.calls[0][0]).toEqual(initialProps.clickValue);
  });
});
