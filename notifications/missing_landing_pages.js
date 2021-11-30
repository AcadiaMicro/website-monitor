
const date = require('date-fns')
const MONITOR_URL = process.env.MONITOR_URL;

module.exports = (ctx) => {
  const pageTemplate = (pageCtx) => {
    return `{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*${pageCtx.slug}* - page was not available during scan"
            }
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "*HTTP Status Code* - ${pageCtx.status}"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Page Load Time* - ${pageCtx.page_time}s"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Scan time* - ${date.format(new Date(pageCtx.run_timestamp), "MM-dd-yy HH:mm OOOO")}"
                }
            ]
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Visit Page",
                        "emoji": true
                    },
                    "value": "visit_page",
                    "url": "${pageCtx.url}"
                }
            ]
        },
        {
            "type": "divider"
        },`;
  };

  let pagesSections = "";
  ctx.landingPages.forEach((landingPage) => {
    pagesSections += pageTemplate(landingPage);
  });

  return `
   [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":warning:  *Website Monitoring Alerts* \\n\\n *${ctx.landingPages.length} landing page(s) on the website not available:*"
                }
            },
            {
                "type": "divider"
            },
            ${pagesSections}
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Run Scan Again",
                            "emoji": true
                        },
                        "value": "scan_again",
                        "url": "${MONITOR_URL}/api/runner"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View Scan Details",
                            "emoji": true
                        },
                        "value": "scan_again",
                        "url": "${MONITOR_URL}/${ctx.run_id}"
                    }
                ]
            }
        ]
    
    `;
};
