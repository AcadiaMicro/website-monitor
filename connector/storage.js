const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports = {
  writeFile: async (buffer, runId, name) => {
    const myBucket = storage.bucket(BUCKET_NAME);
    const file = myBucket.file(`${runId}/${name}`);

    await file.save(buffer);

    const meta = await file.getMetadata();

    return {
      public_url: file.publicUrl(),
      auth_url: `https://storage.cloud.google.com/${meta[0].bucket}/${meta[0].name}`,
    };
  },
};
