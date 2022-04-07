
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
  ctx.failedPagesDetailes.forEach((landingPage) => {
    pagesSections += pageTemplate(landingPage);
  });

  return `
   [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":warning: <!channel> *Website Monitoring Alerts* \\n\\n *${ctx.failed_pages} landing page(s) on the website not available:*"
                }
            },
            {
                "type": "divider"
            },
            ${pagesSections}
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":success: *${ctx.success_pages} landing pages responded successfully.*"
                }
            },
            {
                "type": "divider"
            },      
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "*Scanned Page* - ${ctx.total_pages}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Scan Duration* - ${ctx.duration}s"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Scan Time* - ${date.format(new Date(ctx.timestamp), "MM-dd-yy HH:mm OOOO")}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*AVG Page Time* - ${ctx.avg_page_time}s"
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
                            "text": "View Scan Details",
                            "emoji": true
                        },
                        "value": "scan_details",
                        "url": "${MONITOR_URL}/${ctx.run_id}"
                    }
                ]
            }
        ]
    
    `;
};
