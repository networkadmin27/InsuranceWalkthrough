// Edit this file to add, remove, rename, or reorder workflow pages.
window.workflowNavigation = {
  home: {
    label: "Home",
    path: "index.html"
  },
  platforms: {
    google: {
      label: "Google Workspace",
      pages: [
        {
          id: "email-allowlist",
          label: "Email allowlist",
          path: "google/email-allowlist/index.html"
        },
        {
          id: "inbound-gateway",
          label: "Inbound gateway",
          path: "google/inbound-gateway/index.html"
        },
        {
          id: "approved-senders",
          label: "Approved senders",
          path: "google/approved-senders/index.html"
        },
        {
          id: "content-compliance",
          label: "Content compliance",
          path: "google/content-compliance/index.html"
        },
        {
          id: "image-allowlist",
          label: "Image URL allowlist",
          path: "google/image-allowlist/index.html"
        }
      ]
    },
    microsoft: {
      label: "Microsoft 365",
      pages: [
        {
          id: "mail-flow",
          label: "Mail flow rule",
          path: "microsoft/mail-flow/index.html"
        },
        {
          id: "junk-bypass",
          label: "Junk folder bypass",
          path: "microsoft/junk-bypass/index.html"
        },
        {
          id: "defender",
          label: "Defender Advanced Delivery",
          path: "microsoft/defender/index.html"
        }
      ]
    }
  }
};
