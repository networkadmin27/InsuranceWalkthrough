(() => {
  const config = window.workflowNavigation;
  const rendererScript = document.currentScript;

  function showError(element, message) {
    if (!element) return;
    element.classList.add("data-error");
    element.textContent = `Navigation configuration error: ${message}`;
    console.error(`Navigation configuration error: ${message}`);
  }

  function validText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function validatePlatform(platformKey, platform) {
    if (!platform || !validText(platform.label) || !Array.isArray(platform.pages) || platform.pages.length === 0) {
      throw new Error(`Invalid platform: ${platformKey}`);
    }

    const ids = new Set();
    platform.pages.forEach((page) => {
      if (!page || !validText(page.id) || !validText(page.label) || !validText(page.path) || ids.has(page.id)) {
        throw new Error(`Invalid or duplicate page in ${platformKey}`);
      }
      ids.add(page.id);
    });
  }

  function createLink(path, label, smallLabel) {
    const link = document.createElement("a");
    link.href = new URL(path, siteRoot).href;

    if (smallLabel) {
      const small = document.createElement("small");
      small.textContent = smallLabel;
      link.append(small);
    }

    link.append(document.createTextNode(label));
    return link;
  }

  function createPageList(platform, currentPage) {
    const pageList = document.createElement("ol");
    platform.pages.forEach((listedPage) => {
      const item = document.createElement("li");
      const link = createLink(listedPage.path, listedPage.label);
      if (listedPage.id === currentPage.id) link.setAttribute("aria-current", "page");
      item.append(link);
      pageList.append(item);
    });
    return pageList;
  }

  if (!config || !rendererScript || !validText(rendererScript.src)) {
    document.querySelectorAll("[data-workflow-start], [data-workflow-breadcrumb], [data-workflow-mobile-nav], [data-workflow-sidebar], [data-workflow-position], [data-workflow-page-label], [data-workflow-pagination]").forEach((element) => {
      showError(element, "workflow-navigation.js did not load");
    });
    return;
  }

  const siteRoot = new URL("../", rendererScript.src);

  document.querySelectorAll("[data-workflow-start]").forEach((link) => {
    const platformKey = link.dataset.workflowStart;
    const platform = config.platforms?.[platformKey];

    try {
      validatePlatform(platformKey, platform);
      link.href = new URL(platform.pages[0].path, siteRoot).href;
      link.textContent = platform.label;
    } catch (error) {
      showError(link, error.message);
    }
  });

  const platformKey = document.body.dataset.workflowPlatform;
  const pageId = document.body.dataset.workflowPage;
  if (!platformKey && !pageId) return;

  const breadcrumb = document.querySelector("[data-workflow-breadcrumb]");
  const mobileNavigation = document.querySelector("[data-workflow-mobile-nav]");
  const sidebar = document.querySelector("[data-workflow-sidebar]");
  const position = document.querySelector("[data-workflow-position]");
  const pageLabel = document.querySelector("[data-workflow-page-label]");
  const pagination = document.querySelector("[data-workflow-pagination]");

  try {
    const platform = config.platforms?.[platformKey];
    validatePlatform(platformKey, platform);

    if (!config.home || !validText(config.home.label) || !validText(config.home.path)) {
      throw new Error("Invalid home page");
    }

    const pageIndex = platform.pages.findIndex((page) => page.id === pageId);
    if (pageIndex < 0) throw new Error(`Unknown page: ${pageId}`);
    const page = platform.pages[pageIndex];

    breadcrumb.setAttribute("aria-label", "Breadcrumb");
    const homeLink = createLink(config.home.path, config.home.label);
    const separator = document.createElement("span");
    separator.textContent = "›";
    breadcrumb.replaceChildren(homeLink, separator, document.createTextNode(platform.label));

    const mobileSummary = document.createElement("summary");
    const mobilePlatform = document.createElement("span");
    mobilePlatform.className = "mobile-step-platform";
    mobilePlatform.textContent = platform.label;
    const mobileCurrent = document.createElement("strong");
    mobileCurrent.textContent = `Section ${pageIndex + 1} of ${platform.pages.length} · ${page.label}`;
    mobileSummary.append(mobilePlatform, mobileCurrent);
    mobileNavigation.setAttribute("aria-label", `${platform.label} sections`);
    mobileNavigation.replaceChildren(mobileSummary, createPageList(platform, page));

    sidebar.setAttribute("aria-label", `${platform.label} sections`);
    const sidebarTitle = document.createElement("h2");
    sidebarTitle.textContent = platform.label;
    sidebar.replaceChildren(sidebarTitle, createPageList(platform, page));

    position.textContent = `Section ${pageIndex + 1} of ${platform.pages.length}`;
    pageLabel.textContent = page.label;

    const previousPage = platform.pages[pageIndex - 1];
    const nextPage = platform.pages[pageIndex + 1];
    const previousLink = previousPage
      ? createLink(previousPage.path, previousPage.label, "Previous")
      : createLink(config.home.path, config.home.label, "Previous");
    const nextLink = nextPage
      ? createLink(nextPage.path, nextPage.label, "Next")
      : createLink(config.home.path, "Return home", "Finished");
    pagination.setAttribute("aria-label", "Previous and next sections");
    pagination.replaceChildren(previousLink, nextLink);
  } catch (error) {
    [breadcrumb, mobileNavigation, sidebar, position, pageLabel, pagination].forEach((element) => showError(element, error.message));
  }
})();
