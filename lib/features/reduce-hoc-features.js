const reduceHocFeatures = (Component, hocFeatures, forgedProps) => {
  return hocFeatures.reduce((ForgedComponent, hocFeature) => {
    // TODO: validate hocFeature result
    return hocFeature(ForgedComponent);
  }, Component);
};

export default reduceHocFeatures;
