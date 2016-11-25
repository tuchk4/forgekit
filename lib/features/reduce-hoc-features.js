const reduceHocFeatures = (Component, hocFeatures, forgedProps) => {
  let ForgedComponent = Component;
  for (let i = 0, len = hocFeatures.length; i < len; i++) {
    // TODO: validate hocFeature result
    const hocFeature = hocFeatures[i];
    ForgedComponent = hocFeature(ForgedComponent);
  }

  return ForgedComponent;
};

export default reduceHocFeatures;
