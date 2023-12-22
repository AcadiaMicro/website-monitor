const HoneybadgerSourceMapPlugin = require('@honeybadger-io/webpack');
const { execSync } = require('child_process');

const { HONEYBADGER_API_KEY, HONEYBADGER_ASSETS_URL, NODE_ENV } = process.env;
const HONEYBADGER_REVISION = execSync('git rev-parse HEAD').toString().trim();

const ContentSecurityPolicy = `
  connect-src 'self' 
  *.honeybadger.io
  *.ampion.net
  *.bing.com
  *.wistia.com
  *.litix.io
  *.segment.com
  *.segment.io
  *.google-analytics.com
  *.oribi.io
  *.doubleclick.net; 

  default-src 'self'; 

  font-src 'self' data:; 

  frame-src 'self' 
  www.youtube.com
  www.google.com
  *.doubleclick.net
  *.wistia.com; 

  img-src 'self'
  * data:; 

  media-src 'self' blob:; 

  style-src 'self' 'unsafe-inline'; 

  script-src 
  'self' 
  'unsafe-eval' 
  *.google.com
  *.gstatic.com
  *.segment.com
  blob:; 

  script-src-elem 'self' 'unsafe-inline'
  *.wistia.com
  *.segment.com
  *.google.com
  *.google-analytics.com
  *.googleadservices.com
  *.googletagmanager.com
  *.doubleclick.net
  *.gstatic.com
  *.ads-twitter.com
  *.facebook.net
  *.bing.com
  *.licdn.com
  *.nextdoor.com
`;

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
    async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  env: {
    DATOCMS_API_TOKEN: process.env.DATOCMS_API_TOKEN,
    DATOCMS_API_URL: process.env.DATOCMS_API_URL,
    BASEURL: process.env.BASEURL,
    SLACK_NOTIFICATION_URL: process.env.SLACK_NOTIFICATION_URL,
    MONITOR_URL: process.env.MONITOR_URL,
    FIRESTORE_DB: process.env.FIRESTORE_DB,
    BUCKET_NAME: process.env.BUCKET_NAME,
    BROWSERSTACK_USERNAME: process.env.BROWSERSTACK_USERNAME,
    BROWSERSTACK_ACCESS_KEY: process.env.BROWSERSTACK_ACCESS_KEY,
    DEFAULT_RUNNER: process.env.DEFAULT_RUNNER,
    HONEYBADGER_API_KEY: HONEYBADGER_API_KEY,
    HONEYBADGER_ENV: process.env.HONEYBADGER_ENV,
    HONEYBADGER_REVISION: HONEYBADGER_REVISION,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_AUTH_REDIRECT_URL: process.env.GOOGLE_AUTH_REDIRECT_URL,
    API_ACCESS_KEY: process.env.API_ACCESS_KEY
  },
  webpack: (config) => {
    if (
      HONEYBADGER_API_KEY &&
      HONEYBADGER_ASSETS_URL &&
      NODE_ENV === 'production'
    ) {
      config.devtool = 'hidden-source-map';

      config.plugins.push(
        new HoneybadgerSourceMapPlugin({
          apiKey: HONEYBADGER_API_KEY,
          assetsUrl: HONEYBADGER_ASSETS_URL,
          revision: HONEYBADGER_REVISION,
        }),
      );
    }

    config.module.rules = config.module.rules.concat([
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ]);

    return config;
  },
}
