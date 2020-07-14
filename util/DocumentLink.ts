/**
 * Returns a document link to an object with the given id.
 *
 * @param id The id of the document.
 * @return A link string to the document that can be used by azure StoredProc functions.
 */
export const documentLink = (id: string) =>
  `${getContext()
    .getCollection()
    .getAltLink()}/docs/${id}`;
