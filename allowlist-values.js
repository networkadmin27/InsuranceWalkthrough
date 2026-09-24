// Edit this file to update values everywhere on the site.
window.allowlistValues = {
  domains: {
    active: [
      "cyberpools.org",
      "systememail.org",
      "systememails.org",
      "cybertoolkit.org"
    ],
    inactive: [
      "account-security-dashboard.com",
      "thetrustcloudserver.net",
      "acountservice.com",
      "bizdevsvc1.com"
    ]
  },
  ipAddresses: {
    active: [
      "192.236.245.178",
      "192.236.245.179",
      "192.236.245.180"
    ],
    inactive: [
      "49.13.195.61",
      "116.203.215.192",
      "157.90.166.12",
      "142.171.148.66",
      "142.171.148.67",
      "142.171.148.68"
    ]
  },
  google: {
    contentCompliance: {
      envelopeSenderExpression: "@systememail.org"
    },
    imageAllowlist: {
      urlPatterns: [
        "https://images.cybertoolkit.org/",
        "https://images.systememail.org/"
      ],
      testImageUrl: "https://images.systememail.org/test-image.png"
    }
  },
  microsoft: {
    defender: {
      simulationUrls: [
        "cybertoolkit.org",
        "training.cybertoolkit.org"
      ]
    },
    junkBypass: {
      firstHeader: {
        name: "X-MS-Exchange-Organization-BypassClutter",
        value: "true"
      },
      secondHeader: {
        name: "X-Forefront-Antispam-Report",
        value: "SFV:SKI;CAT:NONE;"
      }
    }
  }
};
