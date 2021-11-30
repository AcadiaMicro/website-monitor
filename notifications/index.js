const axios = require("axios");
const SLACK_NOTIFICATION_URL = process.env.SLACK_NOTIFICATION_URL;

const templates = {
  missing_landing_pages: require("./missing_landing_pages"),
  success_run: require("./success_run"),
};

module.exports = async (type, ctx) => {
  try {
    const res = await axios.post(
      SLACK_NOTIFICATION_URL,
      {
        blocks: JSON.parse(templates[type](ctx)),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(res.data);
  } catch (err) {
    console.log("ERR", err);
  }
};
