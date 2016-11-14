const splitFeatures = (features) => {
  const hocFeatures = [];
  const propsFeatures = [];

  for (const feature of features) {
    if (feature.hoc) {
      hocFeatures.push(feature.hoc);
    }

    if (feature.props) {
      propsFeatures.push(feature.props);
    }
  }

  return { hocFeatures, propsFeatures };
};

export default splitFeatures;
