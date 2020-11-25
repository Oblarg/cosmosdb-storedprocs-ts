# Azure CosmosDB Stored Procedures with Typescript

This repository contains a small set of example code to demonstrate how to use webpack to write Azure CosmosDB stored procedures in Typescript with node dependencies.

The default CosmosDB Stored Procedure API is callback-based, and thus extremely verbose.  The ability to bundle node dependencies inline allows us to wrap the default API with `promisify`, turning it into a much more-tractable Promise-based API.

Additionally, the use of Typescript has the usual benefits of added compile-time safety.

## Why should I use this?

Compare the following identical stored procedures (the former using the default API, the latter using this webpack-based setup):

Default:

```javascript
({ id, patch }) => {
  getContext()
    .getCollection()
    .readDocument(
      `${getContext().getCollection().getAltLink()}/docs/${id}`,
      (err, res) => {
        if (err) {
          abort(err);
        }

        const updated = Object.assign(res, patch);

        getContext()
          .getCollection()
          .replaceDocument(
            `${getContext().getCollection().getAltLink()}/docs/${id}`,
            updated,
            (err) => {
              if (err) {
                abort(err);
              }

              getContext().getResponse().setBody(updated);
            }
          );
      }
    );
};
```

With this tool:

```typescript
import {readDocument, replaceDocument} from "../../util/AsyncDb";
import {handleError} from "../../util/HandleError";

const patchDocument = async ({id, patch} : {id: string, patch: {}}) => {
  const updated = Object.assign(await readDocument(id), patch);

  await replaceDocument(id, updated);

  getContext()
    .getResponse()
    .setBody(updated);
};

patchDocument(args).catch(handleError);
```

## How does this work?

The basic idea is to use webpack to both compile the Typescript and to bundle any included dependencies inline into a single function.

This is somewhat less-trivial of a task than it might initially seem, because Azure CosmosDB's documentation is somewhat nebulous about the format it actually accepts.  Through trial-and-error, I have determined that the easiest way to generate output that CosmosDB will accept is to define the stored procedure body as an [IIFE](https://en.wikipedia.org/wiki/Immediately_invoked_function_expression), compile the IIFE with webpack, and then wrap the output in a lambda that passes the appropriate function argument.  Thus, what is ultimately sent to CosmosDB looks like this:

```javascript
(args) => {
    // WEBPACK OUTPUT HERE
}
```

It is necessary to define an IIFE and then re-wrap it into a function in order to avoid webpack's tree-shaking optimization simply discarding the entirety of the function body (since, if it is not called, it does nothing).

## Structure

I've structured this example to closely match how I've used this methodology in practice.  Note that the particular directory structure is explicitly used by the build script, and so the build script must be also be changed if you wish to modify it.

### util

The `util` directory contains various utility functions that reduce the amount of verbosity required to write CosmosDB stored procedures.  I strongly recommend using the existing functions in this example, as well as expanding them to fit your use-case.

### scripts

The `scripts` directory contains the source for the stored procedure scripts themselves.  The scripts are stored in subdirectories whose name matches the containers of your CosmosDB database.  Note that, as mentioned above, the scripts themselves are written as IIFEs that accept a single object as an argument.

### output

The `output` directory contains the compiled javascript webpack output, with all node dependencies bundled inline.  The compiled output is effectively temporary data (the build script immediately uploads it to CosmosDb after compilation), so this directory should generally be gitignored, but a piece of example output has been included here for the sake of clarity.

### index

The index consists of a very simple example of how to call an uploaded stored procedure.

## How do I use this?

1. Fork and clone the repository.

2. Modify `database.js` to include your actual connection string, database name, and container names.

3. Modify the subdirectories of `scripts` and `output` to match the names of your database containers.

4. Write stored procedures in `scripts` following the general pattern I've laid out in the example.

5. Deploy your scripts to CosmosDB with `npm run build-storedprocs` (make sure you have run `npm install` first!).

## Drawbacks/Issues

Webpack output is generally unreadable (as can be easily seen by glancing at the `outputs` directory).  This means that the stored procedure bodies on CosmosDB will be opaque.  It is thus imperative that people working on the project be aware of the location of the source files for debugging.

`awesome-typescript-loader` occasionally swallows compilation errors - it will alert you that there has been an error, but leave out the details.  I've yet to figure out how to fix this.  It is always possible to manually run `tsc` on your storedproc body to get more detailed error information if compilation is failing.

## Questions

Feel free to post any questions on the issues page; I will attempt to respond to them in a timely manner.
