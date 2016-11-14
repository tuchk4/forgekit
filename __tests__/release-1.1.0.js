import React from 'react';
import renderer from 'react-test-renderer';

import forge from '../lib';

describe('postForg feature', () => {
  it('should call features and postForge in corret order', () => {
    const order = [];
    const featureMock1 = jest.fn(() => {
      order.push('mock1');
      return {};
    });

    featureMock1.postForge = () => {
      order.push('postForge mock1');
      return {};
    };

    const featureMock2 = jest.fn(() => {
      order.push('mock2');
      return {};
    });

    featureMock2.postForge = () => {
      order.push('postForge mock2');
      return {};
    };

    const featureMock3 = jest.fn(() => {
      order.push('mock3');
      return {};
    });

    const features = forge(featureMock1, featureMock2, featureMock3);
    const AwesomeComponent = () => <div>Hello</div>;
    const ForgedComponent = features(AwesomeComponent);

    renderer.create(<ForgedComponent />);

    /**
     * Features are called as they defined at forge.
     * postForge feature's functions are called after all features
     */
    expect(order).toEqual([
      'mock1',
      'mock2',
      'mock3',
      'postForge mock1',
      'postForge mock2',
    ]);
  });
});
