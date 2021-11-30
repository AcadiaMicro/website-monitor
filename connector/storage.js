const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

module.exports = {
  writeFile: async (buffer, runId, name) => {
    const myBucket = storage.bucket("website-monitor");
    const file = myBucket.file(`${runId}/${name}`);

    await file.save(buffer);

    const meta = await file.getMetadata();

    return {
      public_url: file.publicUrl(),
      auth_url: `https://storage.cloud.google.com/${meta[0].bucket}/${meta[0].name}`,
    };
  },
};
