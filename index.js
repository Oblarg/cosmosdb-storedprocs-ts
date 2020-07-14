const containers = require("./database");

// Example call of our example stored procedure
containers["exampleContainer"].scripts.storedProcedure("PatchDocument").execute(
  "DOCUMENT_PARTITION_KEY",
  // Note that the param here is exactly as defined in our storedproc typescript function!
  {
    id: "DOCUMENT_ID",
    patch: {
      // Document patch here
    },
  }
);
