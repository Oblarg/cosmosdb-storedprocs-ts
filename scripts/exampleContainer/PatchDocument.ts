// We can write our stored procedure now as an ordinary Typescript IIFE.
// We can even import arbitrary node dependencies!

import {readDocument, replaceDocument} from "../../util/AsyncDb";
import {handleError} from "../../util/HandleError";

/**
 * Example document patch stored procedure using Object.assign to merge a partial-object patch.
 * Note that our function arguments *must* be wrapped in an object, since they are passed as "args"
 * later on.
 *
 * @param id
 * @param patch
 */
const patchDocument = async ({id, patch} : {id: string, patch: {}}) => {
  const updated = Object.assign(await readDocument(id), patch);

  await replaceDocument(id, updated);

  getContext()
    .getResponse()
    .setBody(updated);
};

// Boilerplate call to the function we've just defined (IIFE), required to make the build procedure function
// The build procedure wraps the IIFE in a lambda with 'args' as a parameter, thus creating a "complete" function
// @ts-ignore
patchDocument(args).catch(handleError);