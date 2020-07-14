// Small patch to correct for error in azure type definitions (adds typedef for abort function)
/** The Context object provides access to all operations that can be performed on Cosmos DB data, as well as access to the request and response objects. */
interface IContext {
  /** Gets the collection object. */
  getCollection(): ICollection;
  /** Gets the request object. */
  getRequest(): IRequest;
  /**
   * Gets the response object.
   * Note: this is not available in pre-triggers.
   */
  getResponse(): IResponse;

  abort(err: Error): void;
}