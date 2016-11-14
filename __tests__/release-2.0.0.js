import React, { PropTypes } from 'react';
import renderer from 'react-test-renderer';

import forge, { ThemeProp } from '../lib';

describe('Release 2.0.0: features as hocs and props + feature validation', () => {
  it('Should throw error if feature is not a fucntion or object', () => {
    const feature1 = () => ({});
    const feature2 = [];

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1, feature2);

    // <<AnonymousFeature>>  == feature2.name but feature1 is object.
    expect(() => {
      const ForgedComponent = features(AwesomeComponent);
    }).toThrow(`Forgekit <${AwesomeComponent.name}/>: Invalid "<<AnonymousFeature>>" feature type. Expect Function or Object`);
  });

  it('Should throw error if feature is Object but with wrong attributes keys', () => {
    const feature1 = {
      foo: () => {}
    };

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1);

    // <<AnonymousFeature>>  == feature1.name but feature1 is object.
    expect(() => {
      const ForgedComponent = features(AwesomeComponent);
    }).toThrow(`Forgekit <${AwesomeComponent.name}/>: Invalid "<<AnonymousFeature>>" feature value. Expect at least one function of "props / hoc"`);
  });

  it('Should throw error if feature is Object but with wrong attributes values', () => {
    const feature1 = {
      props: []
    };

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1);

    // <<AnonymousFeature>>  == feature1.name but feature1 is object.
    expect(() => {
      const ForgedComponent = features(AwesomeComponent);
    }).toThrow(`Forgekit <${AwesomeComponent.name}/>: Invalid "<<AnonymousFeature>>" feature value. Expect at least one function of "props / hoc"`);
  });


  it('Should hoc component', () => {
    const Hoc = ({children}) => <span>{children}</span>;

    const hocFeature = jest.fn((props, Component) => (
      <Hoc>
        <Component {...props} />
      </Hoc>
    ));
    const feature1 = {
      hoc: jest.fn((Component) => {
        return (props) => {
          // hocFeature - mock for testing its arguments
          return hocFeature(props, Component);
        };
      })
    };

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1);

    const ForgedComponent = features(AwesomeComponent);
    const initialProps = {
      foo: 'foo'
    };

    const tree = renderer.create(<ForgedComponent {...initialProps} />).toJSON();

    expect(feature1.hoc.mock.calls[0][0]).toEqual(AwesomeComponent);
    expect(hocFeature.mock.calls[0][0]).toEqual(initialProps);

    /**
     * Expect tree to be
     *
     * <span>
     *   <div>Hell</div>
     * </span>
     */
    // <span> - from HOC
    expect(tree.type).toEqual('span');

    // <div> - from AwesomeComponent
    expect(tree.children[0].type).toEqual('div');

    // <div> - from AwesomeComponent
    expect(tree.children[0].children[0]).toEqual('Hello');
  });

  it('Should hoc and props features work correctly together', () => {
    const feature1 = jest.fn(props => {
      return {
        ...props,
        feature1: 'feature1'
      }
    });

    const feature2 = {
      hoc: jest.fn((Component) => {
        return (props) => <span id="feature2"><Component/></span>;
      }),
    };

    const feature3 = {
      props: jest.fn(props => {
        return {
          ...props,
          feature3: 'feature3'
        }
      }),
      hoc: jest.fn((Component) => {
        return (props) => <span id="feature3"><Component/></span>
      }),
    };

    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1, feature2, feature3);
    const ForgedComponent = features(AwesomeComponent);

    const initialProps = {
      foo: 'foo'
    };

    const tree = renderer.create(<ForgedComponent {...initialProps} />).toJSON();

    expect(feature1.mock.calls[0][0]).toEqual(initialProps);
    expect(feature3.props.mock.calls[0][0]).toEqual({
      ...initialProps,
      feature1: 'feature1'
    });

    /**
     * Expect tree to be
     * <span id="feature3">
     *   <span id="feature2">
     *     <div>Hello</div>
     *   </span>
     * </span>
     */
    // <span> - from HOC
    expect(tree.type).toEqual('span');
    expect(tree.props).toEqual({
      id: 'feature3'
    });

    expect(tree.children[0].type).toEqual('span');
    expect(tree.children[0].props).toEqual({
      id: 'feature2'
    });

    expect(tree.children[0].children[0].type).toEqual('div');
    expect(tree.children[0].children[0].children[0]).toEqual('Hello');
  });

  it ('Should throw exception id mountedProps function returns not object', () => {
    const feature1 = () => ({});
    const AwesomeComponent = () => <div>Hello</div>;
    const features = forge(feature1);
    const ForgedComponent = features(AwesomeComponent, 'AwesomeComponent', props => []);

    expect(() => {
      renderer.create(<ForgedComponent />);
    }).toThrow(`Forgekit <${AwesomeComponent.name}/>: "mountedProps" as fucntions should return Object`);
  });

  it ('Should throw excpetion if there are same props with differnet types', () => {
    const feature1 = () => ({});
    feature1.propTypes = {
      foo: PropTypes.bool
    };

    const AwesomeComponent = () => <div>Hello</div>;
    AwesomeComponent.propTypes = {
      foo: PropTypes.string
    };

    const features = forge(feature1);

    expect(() => {
      features(AwesomeComponent);
    }).toThrow(`<${AwesomeComponent.name}/>: Prop "foo" was defined at "${feature1.name}" and "${AwesomeComponent.name}" with different propType`);
  });


  it('Should throw excpetion if there are duplicated theme keys', () => {
    const featureMock1 = jest.fn(() => {});
    featureMock1.propTypes = {
      theme: ThemeProp({
        foo: PropTypes.string,
      }),
    };

    const featureMock2 = jest.fn(() => {});
    featureMock2.propTypes = {
      theme: ThemeProp({
        foo: PropTypes.arrayOf(PropTypes.bool),
      }),
    };


    const features = forge(featureMock1, featureMock2);
    const AwesomeComponent = () => <div>Hello</div>;

    // beacuse of theme key "foo" exists at both featureMock1 and featureMock2
    expect(() => {
      features(AwesomeComponent)
    }).toThrow(`<${AwesomeComponent.name}/>: Theme key "foo" was defined at "${featureMock1.name}" and "${featureMock2.name}" with different propType`);
  });
});
