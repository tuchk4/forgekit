import React, { PropTypes } from 'react';
import renderer from 'react-test-renderer';

import forge, { ThemeProp } from '../lib';


describe('Release 1.3.0: readonly propTypes and defaultProps + wihtProps as func', () => {
  it('Should throw error when set defaultProps', () => {
    const featureMock1 = jest.fn(() => {});
    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(featureMock1);
    const ForgedComponent = features(AwesomeComponent);

    expect(() => {
      ForgedComponent.defaultProps = {};
    }).toThrow(`Forge <${AwesomeComponent.name}/>: deafultProps attribute is readonly`);
  });


  it('Should throw error when set propTypes', () => {
    const featureMock1 = jest.fn(props => props);
    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(featureMock1, 'AwesomeComponent', []);
    const ForgedComponent = features(AwesomeComponent);

    expect(() => {
      ForgedComponent.propTypes = {};
    }).toThrow(`Forge <${AwesomeComponent.name}/>: propTypes attribute is readonly`);
  });

  it('Should throw error when wrong "withProps"', () => {
    const featureMock1 = jest.fn(props => props);
    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(featureMock1);

    expect(() => {
      const ForgedComponent = features(AwesomeComponent, 'AwesomeComponent', 100500);
      renderer.create(<ForgedComponent />);
    }).toThrow(`Forge <${AwesomeComponent.name}/>: "withProps" argument should be Object or Function`);
  });

  it('Should throw error if feature is not a fucntion"', () => {
    const feature1 = () => ({});
    const feature2 = [];

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1, feature2);
    const ForgedComponent = features(AwesomeComponent);

    expect(() => {
      renderer.create(<ForgedComponent />);
    }).toThrow(`Forge <${AwesomeComponent.name}/>: "${feature2.name}" feature should be Function`);
  });

  it('Should throw error if postForge is not a fucntion"', () => {
    const feature1 = () => ({});
    const feature2 = () => ({});
    feature2.postForge = [];

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1, feature2);
    const ForgedComponent = features(AwesomeComponent);

    expect(() => {
      renderer.create(<ForgedComponent />);
    }).toThrow(`Forge <${AwesomeComponent.name}/>: "${feature2.name}" postForge should be Function`);
  });

  it('wihtProps Should process props as function', () => {
    const featureMock1 = jest.fn(props => props);
    const AwesomeComponent = props => <div {...props}>Hello</div>;
    AwesomeComponent.defaultProps = {
      defaultFoo: 'defaultFoo',
    };

    const features = forge(featureMock1);
    const withProps = jest.fn(({
      foo,
      bar,
    }) => {
      return {
        foo: foo + 1,
        bar: bar + 1,
        baz: 'baz',
      };
    });

    const ForgedComponent = features(AwesomeComponent, 'AwesomeComponent', withProps);
    const tree = renderer.create(<ForgedComponent foo="foo" bar="bar" />).toJSON();


    expect(tree.props).toEqual({
      foo: 'foo1',
      bar: 'bar1',
      baz: 'baz',
      defaultFoo: 'defaultFoo',
    });

    expect(withProps.mock.calls[0][0]).toEqual({
      foo: 'foo',
      bar: 'bar',
    });

    expect(featureMock1.mock.calls[0][0]).toEqual({
      foo: 'foo1',
      bar: 'bar1',
      baz: 'baz',
    });
  });
});
