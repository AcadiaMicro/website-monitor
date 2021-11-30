const { Firestore } = require("@google-cloud/firestore");

module.exports = {
  getRun: async (uuid) => {
    const firestore = new Firestore();
    const document = await firestore
      .doc(`website-monitor-runs/${uuid}`)
      .get();

    return document.data();
  },
  get: async () => {
    const firestore = new Firestore();
    const document = await firestore
      .collection(`website-monitor-runs`)
      .select("run_id", "status", "timestamp", "duration", "total_pages", "failed_pages")
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
    const document = firestore.doc(`website-monitor-runs/${uuid}`);
    await document.set(data);
  },
  update: async (uuid, data) => {
    const firestore = new Firestore();
    const document = firestore.doc(`website-monitor-runs/${uuid}`);
    await document.update(data);
  },
};
