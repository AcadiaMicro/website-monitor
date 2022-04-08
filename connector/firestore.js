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
  get: async (limit = 10) => {
    const firestore = new Firestore();
    const document = await firestore
      .collection(FIRESTORE_DB)
      .select("run_id", "status", "timestamp", "duration", "total_pages", "failed_pages", "avg_page_time")
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return document.docs
      .map((doc) => doc.data());
  },
  create: async (uuid, data) => {
    const firestore = new Firestore();
    const document = firestore.doc(`${FIRESTORE_DB}/${uuid}`);
    await document.set(data);
  },
  update: async (uuid, data) => {
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
