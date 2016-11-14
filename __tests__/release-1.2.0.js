import React, { PropTypes } from 'react';
import renderer from 'react-test-renderer';

import forge, { ThemeProp } from '../lib';

describe('Release 1.2.0: Theme property', () => {
  it('Feature should returns only object', () => {
    const featureMock1 = jest.fn(() => {});
    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(featureMock1);
    const ForgedComponent = features(AwesomeComponent);

    expect(() => {
      renderer.create(<ForgedComponent />);
    }).toThrow(`Forgekit <${AwesomeComponent.name}/>: "${featureMock1.name}" feature should return Object`);
  });

  it('Should throw Error if theme is wrong type', () => {
    const featureMock1 = jest.fn(() => {});
    featureMock1.propTypes = {
      theme: PropTypes.shape({
        foo: PropTypes.string,
      }),
    };

    const features = forge(featureMock1);
    const AwesomeComponent = () => <div>Hello</div>;

    /**
     * except to throw Error becasue propType theme should be only ThemeProp type
     * import { ThemeProp } from 'forgekit'
     */
    expect(() => {
      features(AwesomeComponent);
    }).toThrow(`Forgekit <${AwesomeComponent.name}/>: property "theme" should be the ThemeProp type`);
  });

  it('Should merge all theme prop from all features', () => {
    const featureMock1 = jest.fn(() => {});
    featureMock1.propTypes = {
      theme: ThemeProp({
        foo: PropTypes.string,
      }),
    };

    const featureMock2 = jest.fn(() => {});
    featureMock2.propTypes = {
      theme: ThemeProp({
        bar: PropTypes.string,
      }),
    };

    const featureMock3 = jest.fn(() => {});
    featureMock3.propTypes = {
      theme: ThemeProp({
        baz: PropTypes.string,
      }),
    };

    const AwesomeComponent = () => <div>Hello</div>;

    AwesomeComponent.propTypes = {
      theme: ThemeProp({
        base: PropTypes.string,
      }),
    };

    const features = forge(featureMock1, featureMock2, featureMock3);
    const ForgedComponent = features(AwesomeComponent);

    expect(ForgedComponent.propTypes.theme.themeKeys).toEqual([
      'base',
      'foo',
      'bar',
      'baz',
    ]);
  });

  it('Should pick only defined theme keys for feature', () => {
    const featureMock1 = jest.fn(() => ({}));
    featureMock1.propTypes = {
      theme: ThemeProp({
        foo: PropTypes.string,
      }),
    };

    const featureMock2 = jest.fn(() => ({}));
    featureMock2.propTypes = {
      theme: ThemeProp({
        bar: PropTypes.string,
      }),
    };

    const features = forge(featureMock1, featureMock2);
    const AwesomeComponent = jest.fn(() => <div>Hello</div>);

    AwesomeComponent.propTypes = {
      theme: ThemeProp({
        baz: PropTypes.string,
      }),
    };


    const ForgedComponent = features(AwesomeComponent);

    renderer.create(<ForgedComponent theme={{ foo: 'foo', bar: 'bar', baz: 'baz' }} />);

    expect(featureMock1.mock.calls.length).toEqual(1);
    expect(featureMock2.mock.calls.length).toEqual(1);

    expect(AwesomeComponent.mock.calls[0][0].theme).toEqual({
      baz: 'baz',
    });

    // expect that only requested theme keys should be passed to feature function
    expect(featureMock1.mock.calls[0][0].theme).toEqual({
      foo: 'foo',
    });

    // expect that only requested theme keys should be passed to feature function
    expect(featureMock2.mock.calls[0][0].theme).toEqual({
      bar: 'bar',
    });
  });

  it('Should pass default theme values', () => {
    const featureMock1 = jest.fn(() => ({}));
    featureMock1.propTypes = {
      theme: ThemeProp({
        foo: PropTypes.string,
        bar: PropTypes.string,
      }),
    };

    featureMock1.defaultProps = {
      theme: {
        foo: 'defaultFoo',
        bar: 'defaultBar',
      },
    };

    const features = forge(featureMock1);
    const AwesomeComponent = () => <div>Hello</div>;

    const ForgedComponent = features(AwesomeComponent);

    renderer.create(<ForgedComponent />);

    expect(featureMock1.mock.calls[0][0].theme).toEqual({
      /**
       * All valus are defained at featureMock1.defaultProps.theme
       */
      foo: 'defaultFoo',
      bar: 'defaultBar',
    });
  });

  it('Should mere all theme keys from Component and all features', () => {
    const featureMock1 = jest.fn(() => ({}));
    featureMock1.propTypes = {
      theme: ThemeProp({
        foo1: PropTypes.string,
        bar1: PropTypes.string,
      }),
    };

    featureMock1.defaultProps = {
      theme: {
        foo1: 'defaultFoo1',
        bar1: 'defaultBar1',
      },
    };

    const featureMock2 = jest.fn(() => ({}));
    featureMock2.propTypes = {
      theme: ThemeProp({
        foo2: PropTypes.string,
      }),
    };

    featureMock2.defaultProps = {
      theme: {
        foo2: 'defaultFoo2',
      },
    };

    const features = forge(featureMock1, featureMock2);
    const AwesomeComponent = jest.fn(() => <div>Hello</div>);

    AwesomeComponent.propTypes = {
      theme: ThemeProp({
        base: PropTypes.string,
        style: PropTypes.string,
      }),
    };

    AwesomeComponent.defaultProps = {
      theme: {
        base: 'base',
      },
    };

    const ForgedComponent = features(AwesomeComponent, 'AwesomeComponent', {
      theme: {
        style: 'style-from-forge',
      },
    });

    expect(ForgedComponent.propTypes.theme.themeKeys).toEqual([
      'base',
      'style',
      'foo1',
      'bar1',
      'foo2',
    ]);

    expect(ForgedComponent.defaultProps.theme).toEqual({
      foo1: 'defaultFoo1',
      bar1: 'defaultBar1',
      foo2: 'defaultFoo2',
      base: 'base',
    });

    renderer.create(<ForgedComponent />);

    expect(AwesomeComponent.mock.calls[0][0].theme).toEqual({
      base: 'base',
      style: 'style-from-forge',
    });

    expect(featureMock1.mock.calls[0][0].theme).toEqual({
      foo1: 'defaultFoo1',
      bar1: 'defaultBar1',
    });

    expect(featureMock2.mock.calls[0][0].theme).toEqual({
      foo2: 'defaultFoo2',
    });
  });
});
