(() => {
  const values = window.allowlistValues;
  const valueElements = document.querySelectorAll("[data-value], [data-value-list], [data-value-inline-list]");

  function showError(element, path, detail) {
    const message = `Value configuration error: ${path}`;
    element.classList.add("data-error");

    if (element.matches("ul, ol")) {
      const item = document.createElement("li");
      item.textContent = message;
      element.replaceChildren(item);
    } else {
      element.textContent = message;
    }

    console.error(message, detail);
  }

  function getValue(path) {
    return path.split(".").reduce((current, key) => {
      if (current === null || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, key)) {
        throw new Error(`Missing value at ${path}`);
      }
      return current[key];
    }, values);
  }

  function isDomain(value) {
    return /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value);
  }

  function isIpAddress(value) {
    const parts = value.split(".");
    return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
  }

  function isHttpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }

  function isValid(value, type) {
    if (typeof value !== "string" || value.length === 0) return false;
    if (type === "domain") return isDomain(value);
    if (type === "ip") return isIpAddress(value);
    if (type === "https-url") return isHttpsUrl(value);
    if (type === "email-expression") return value.startsWith("@") && isDomain(value.slice(1));
    if (type === "header-name") return /^[A-Za-z0-9-]+$/.test(value);
    return !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
  }

  function readItems(element, attribute) {
    const path = element.dataset[attribute];
    const result = getValue(path);
    const items = Array.isArray(result) ? result : [result];
    const type = element.dataset.valueType || "text";

    if (!items.every((item) => isValid(item, type))) {
      throw new Error(`Invalid ${type} value at ${path}`);
    }

    return { items, path };
  }

  function renderList(element) {
    const { items } = readItems(element, "valueList");
    const prefix = element.dataset.valuePrefix || "";

    if (items.length === 0) {
      const item = document.createElement("li");
      item.className = "empty-values";
      item.textContent = "None";
      element.replaceChildren(item);
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((value) => {
      const item = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = prefix + value;
      item.append(code);
      fragment.append(item);
    });
    element.replaceChildren(fragment);
  }

  function renderValue(element) {
    const { items } = readItems(element, "value");
    const separator = element.dataset.valueSeparator || ", ";
    const prefix = element.dataset.valuePrefix || "";
    element.textContent = items.map((value) => prefix + value).join(separator);
  }

  function renderInlineList(element) {
    const { items } = readItems(element, "valueInlineList");
    const fragment = document.createDocumentFragment();

    items.forEach((value, index) => {
      if (index > 0) {
        const separator = items.length === 2 ? " and " : index === items.length - 1 ? ", and " : ", ";
        fragment.append(document.createTextNode(separator));
      }
      const strong = document.createElement("strong");
      strong.textContent = value;
      fragment.append(strong);
    });

    element.replaceChildren(fragment);
  }

  valueElements.forEach((element) => {
    const path = element.dataset.value || element.dataset.valueList || element.dataset.valueInlineList;
    try {
      if (!values) throw new Error("allowlist-values.js did not load");
      if (element.dataset.valueList) renderList(element);
      else if (element.dataset.valueInlineList) renderInlineList(element);
      else renderValue(element);
    } catch (error) {
      showError(element, path, error);
    }
  });
})();
