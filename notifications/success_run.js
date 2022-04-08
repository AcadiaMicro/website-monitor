
const date = require('date-fns')
const MONITOR_URL = process.env.MONITOR_URL;

module.exports = (ctx) => {

  return `
   [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": ":success:  *Website Monitoring Report* \\n\\n *All landing pages responded successfully.*"
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
                "type": "divider"
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
