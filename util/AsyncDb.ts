import { promisify } from "util";
import { documentLink } from "./DocumentLink";

// Using promisify here allows us to replace the obnoxious callback API with
// a much better async API.

// We also modify the API to take object IDs directly, rather than require the user
// to figure out the document link string.

// This can (obviously) be expanded to whichever CosmosDB StoredProc API functions you wish to wrap.

/**
 * Promisified read document function.
 */
export const readDocument: <T>(id: string) => Promise<T> = promisify<
  string,
  any
>((id, callback) => getContext().getCollection().readDocument(documentLink(id), callback));

/**
 * Promisified replace document function.
 */
export const replaceDocument: <T>(
  id: string,
  document: T
) => Promise<{}> = promisify<string, {}, {}>((id, document, callback) =>
  getContext().getCollection().replaceDocument(documentLink(id), document, callback)
);
