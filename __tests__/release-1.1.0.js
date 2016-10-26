import React from 'react';
import renderer from 'react-test-renderer';

import forge from '../lib';

// original component
import Button from './components/button';

describe('postForg feature', () => {
  it('should call features and postForge in corret order', () => {
    const order = [];
    const featureMock1 = jest.fn(() => {
      order.push('mock1');
    });

    featureMock1.postForge = () => {
      order.push('postForge mock1');
    };

    const featureMock2 = jest.fn(() => {
      order.push('mock2');
    });

    featureMock2.postForge = () => {
      order.push('postForge mock2');
    };

    const featureMock3 = jest.fn(() => {
      order.push('mock3');
    });

    const features = forge(featureMock1, featureMock2, featureMock3);

    const FeaturesButton = features(Button);

    renderer.create(<FeaturesButton />);

    expect(order).toEqual([
      'mock1',
      'mock2',
      'mock3',
      'postForge mock1',
      'postForge mock2',
    ]);
  });
});
