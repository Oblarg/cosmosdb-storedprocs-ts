/**
 * Simple error handler; should be used for *every* stored procedure.
 *
 * @param err The error to handle
 */
export const handleError = (err: Error) => getContext().abort(err);
