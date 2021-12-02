const { Firestore } = require("@google-cloud/firestore");

const FIRESTORE_DB = process.env.FIRESTORE_DB;

module.exports = {
  getRun: async (uuid) => {
    const firestore = new Firestore();
    const document = await firestore
      .doc(`${FIRESTORE_DB}/${uuid}`)
      .get();

    return document.data();
  },
  get: async () => {
    const firestore = new Firestore();
    const document = await firestore
      .collection(FIRESTORE_DB)
      .select("run_id", "status", "timestamp", "duration", "total_pages", "failed_pages", "avg_page_time")
      .get();

    return document.docs
      .map((doc) => doc.data())
      .sort((a, b) => {
        return a.timestamp > b.timestamp
          ? -1
          : a.timestamp < b.timestamp
          ? 1
          : 0;
      });
  },
  create: async (uuid, data) => {
    const firestore = new Firestore();
    const document = firestore.doc(`${FIRESTORE_DB}/${uuid}`);
    await document.set(data);
  },
  update: async (uuid, data) => {
    console.log(data)
    const firestore = new Firestore();
    const document = firestore.doc(`${FIRESTORE_DB}/${uuid}`);
    await document.update(data);
  },
  remove: async (uuid) => {
    const firestore = new Firestore();
    const document = firestore.doc(`${FIRESTORE_DB}/${uuid}`);
    await document.delete();
  }
};
