const listMongoServerError = {
  "11000": {
    "type": "duplicate",
    "message": "There is already a document with the value '{{value}}' registered in the '{{field}}' field."
  },
  "unknown": {
    "type": "unknown",
    "message": "Unknown database error."
  }
}

export default listMongoServerError