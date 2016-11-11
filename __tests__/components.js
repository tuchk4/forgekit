import React from 'react';
import renderer from 'react-test-renderer';

import forge from '../lib';

// original component
import Button from './components/button';

// features
import icon from './components/button/features/icon';
import clickValue from './components/button/features/click-value';
import highlightFlags from './components/features/highlite-flags';

describe('Components tests', () => {
  it('Should render component correctly', () => {
    const features = forge(icon, clickValue, highlightFlags);
    const FeaturesButton = features(Button, 'FeaturesButton');

    const componentProps = {
      alert: true,
      clickValue: 'yo',
      iconPosition: 'right',
      icon: 'mail',
    };

    const component = renderer.create(<FeaturesButton {...componentProps} />);
    const tree = component.toJSON();

    const propsKeys = Object.keys(tree.props);

    // Expect result props at already rendered component
    expect(propsKeys).toEqual([
      // There no Button props at componentProps so all default props are apllied
      ...Object.keys(Button.defaultProps),
      // from clikcValue feature
      'onClick',
      // from highlightFlags feature
      'style',
    ]);


    expect(tree.props.style).toEqual({
      /**
       * highlightFlags provide style color:red if "alert" flag exists
       */
      color: 'red',
    });
  });

  it('Should wrap onClick wiht hof (clikcValue feature)', () => {
    const onClickMock = jest.fn();

    const features = forge(clickValue, highlightFlags);
    const FeaturesButton = features(Button, 'FeaturesButton');

    const initialProps = {
      clickValue: 'yo',
      onClick: onClickMock,
    };

    renderer.create(<FeaturesButton {...initialProps} />);
    // to test arguments for onClick callbacck we should use enzyme.shallow
    // expect(onClickMock.mock.calls[0][0]).toEqual(initialProps.clickValue);
  });
});
