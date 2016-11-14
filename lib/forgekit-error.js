const ANONYMOUS = '<<AnonymousComponent>>';

export const generateErrorMessage = (Component, message) => {
  return `Forgekit <${Component.displayName || Component.name || ANONYMOUS}/>: ${message}`;
};

export default class ForgekitError extends Error {
  constructor(Component, message) {
    const errorMessage = generateErrorMessage(Component, message);
    super(errorMessage);
  }
}
