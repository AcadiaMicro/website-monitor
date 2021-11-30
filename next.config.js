/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    DATOCMS_API_TOKEN: process.env.DATOCMS_API_TOKEN,
    DATOCMS_API_URL: process.env.DATOCMS_API_URL,
    BASEURL: process.env.BASEURL,
    SLACK_NOTIFICATION_URL: process.env.SLACK_NOTIFICATION_URL,
    MONITOR_URL: process.env.MONITOR_URL,
    FIRESTORE_DB: process.env.FIRESTORE_DB
  },
}
