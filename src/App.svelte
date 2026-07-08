<script>
  import { onMount, tick } from "svelte";

  const notesStorageKey = "securityToolsNotes";
  const navigationStorageKey = "securityToolsNavigationState";

  const groups = [
    {
      id: "recon",
      label: "Reconnaissance",
      phase: "Discovery",
      icon: "icons/espionage.png",
      tabs: [
        {
          id: "osint",
          label: "OSINT",
          shortLabel: "OS",
          phase: "OSINT",
          icon: "icons/osint-icon.png",
          children: [
            { label: "Dorking", page: "pages/recon-osint-dorking.html" },
            { label: "GitHub Search", page: "pages/recon-osint-github.html" },
            { label: "Emails", page: "pages/recon-osint-emails.html" },
            { label: "Breaches", page: "pages/recon-osint-breaches.html" }
          ]
        },
        {
          id: "ports",
          label: "Port Scanning",
          shortLabel: "PS",
          phase: "Port Scanning",
          icon: "icons/nmap-icon.png",
          children: [
            { label: "Nmap", page: "pages/Nmap.html" },
            { label: "Masscan", page: "pages/recon-port-masscan.html" }
          ]
        },
        {
          id: "services",
          label: "Service Enumeration",
          shortLabel: "SE",
          phase: "Service Enumeration",
          icon: "icons/dns-icon.png",
          children: [
            { label: "DNS", page: "pages/recon-dns.html" },
            { label: "SMB", page: "pages/recon-svc-smb.html" },
            { label: "SMTP", page: "pages/recon-svc-smtp.html" },
            { label: "FTP", page: "pages/recon-svc-ftp.html" },
            { label: "HTTP", page: "pages/recon-svc-http.html" }
          ]
        }
      ]
    },
    {
      id: "web",
      label: "Web Vuln",
      phase: "Exploitation",
      icon: "icons/web-vuln-icon.png",
      tabs: [
        { id: "lfi", label: "LFI", shortLabel: "LFI", phase: "File Inclusion", page: "pages/web-lfi.html" },
        { id: "sqli", label: "SQL Injection", shortLabel: "SQL", phase: "Injection", page: "pages/web-sqli.html" },
        { id: "xss", label: "XSS", shortLabel: "XSS", phase: "Client-Side", page: "pages/web-xss.html" }
      ]
    }
  ];

  const singleTabs = [
    { label: "Reverse Shell", phase: "Payloads", page: "pages/reverse-shells.html", icon: "icons/reverse-shell-icon.png" },
    { label: "Linux Commands", phase: "Post-Exploitation", page: "pages/linux-commands.html", icon: "icons/linux-icon.png" },
    { label: "Notes", phase: "Workspace", page: "pages/notes.html", icon: "icons/notes-icon.png" }
  ];

  const pageMeta = {
    "pages/reconnaissance.html": { section: "Discovery", phase: "Field Kit", label: "Reconnaissance" },
    "pages/recon-osint-dorking.html": { section: "Reconnaissance", phase: "OSINT", label: "Dorking" },
    "pages/recon-osint-github.html": { section: "Reconnaissance", phase: "OSINT", label: "GitHub Search" },
    "pages/recon-osint-emails.html": { section: "Reconnaissance", phase: "OSINT", label: "Emails" },
    "pages/recon-osint-breaches.html": { section: "Reconnaissance", phase: "OSINT", label: "Breaches" },
    "pages/Nmap.html": { section: "Reconnaissance", phase: "Port Scanning", label: "Nmap" },
    "pages/recon-port-masscan.html": { section: "Reconnaissance", phase: "Port Scanning", label: "Masscan" },
    "pages/recon-dns.html": { section: "Reconnaissance", phase: "Service Enumeration", label: "DNS" },
    "pages/recon-svc-smb.html": { section: "Reconnaissance", phase: "Service Enumeration", label: "SMB" },
    "pages/recon-svc-smtp.html": { section: "Reconnaissance", phase: "Service Enumeration", label: "SMTP" },
    "pages/recon-svc-ftp.html": { section: "Reconnaissance", phase: "Service Enumeration", label: "FTP" },
    "pages/recon-svc-http.html": { section: "Reconnaissance", phase: "Service Enumeration", label: "HTTP" },
    "pages/web-vuln.html": { section: "Exploitation", phase: "Web Vulnerabilities", label: "Web Vuln" },
    "pages/web-lfi.html": { section: "Web Vuln", phase: "File Inclusion", label: "LFI" },
    "pages/web-sqli.html": { section: "Web Vuln", phase: "Injection", label: "SQL Injection" },
    "pages/web-xss.html": { section: "Web Vuln", phase: "Client-Side", label: "XSS" }
  };

  const navIconClass = "block h-[29px] w-[29px] object-contain";
  const subIconClass = "block h-[21px] w-[21px] object-contain";

  function navButtonClass(isActive) {
    return [
      "btn btn-ghost btn-square btn-sm h-11 min-h-0 w-11 rounded-md border border-transparent p-0 transition-colors",
      isActive ? "border-primary/40 bg-primary text-primary-content hover:bg-primary" : "text-neutral-content hover:border-primary/20 hover:bg-primary/10"
    ].join(" ");
  }

  function subTabClass(isActive) {
    return [
      "btn btn-ghost btn-square h-7 min-h-0 w-11 rounded border border-transparent px-1 text-[11px]",
      isActive ? "border-primary/40 bg-primary/90 text-primary-content hover:bg-primary" : "bg-white/5 text-neutral-content hover:border-primary/20 hover:bg-primary/10"
    ].join(" ");
  }

  function dropdownItemClass(isActive) {
    return [
      "rounded px-2 py-1 text-[11px] tracking-wide",
      isActive ? "active" : ""
    ].join(" ");
  }

  function getActiveMeta() {
    if (pageMeta[activePage]) {
      return pageMeta[activePage];
    }

    for (const group of groups) {
      for (const tab of group.tabs) {
        if (tab.page === activePage) {
          return {
            section: group.label,
            phase: tab.phase ?? group.phase,
            label: tab.label
          };
        }

        const child = tab.children?.find((item) => item.page === activePage);

        if (child) {
          return {
            section: group.label,
            phase: child.phase ?? tab.phase ?? group.phase,
            label: child.label
          };
        }
      }
    }

    const singleTab = singleTabs.find((tab) => tab.page === activePage || tab.matchPages?.includes(activePage));

    if (singleTab) {
      return {
        section: singleTab.phase,
        phase: "Field Kit",
        label: singleTab.label
      };
    }

    return {
      section: "Workspace",
      phase: "Field Kit",
      label: "Ready"
    };
  }

  let openGroup = "recon";
  let openNested = "osint";
  let activePage = "pages/recon-osint-dorking.html";
  let pageHtml = "";
  let rsState = {
    ip: "192.168.45.166",
    port: "4444"
  };

  $: activeOpenGroup = groups.find((group) => group.id === openGroup);

  onMount(() => {
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest(".custom-select")) {
        closeCustomSelects();
      }
    };

    document.addEventListener("click", closeOnOutsideClick);
    loadSavedState();
    loadPage(activePage);

    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
    };
  });

  function loadSavedState() {
    const savedState = localStorage.getItem(navigationStorageKey);

    if (!savedState) {
      return;
    }

    try {
      const parsedState = JSON.parse(savedState);
      openGroup = parsedState.openGroup ?? openGroup;
      openNested = parsedState.openNested ?? openNested;
      activePage = parsedState.activePage ?? activePage;

      if (activePage?.startsWith("pages/rs-")) {
        openGroup = null;
        openNested = null;
        activePage = "pages/reverse-shells.html";
      }

      if (activePage === "pages/reconnaissance.html") {
        openGroup = null;
        openNested = null;
        activePage = "pages/recon-osint-dorking.html";
      }

      if (activePage === "pages/web-vuln.html") {
        openGroup = null;
        openNested = null;
        activePage = "pages/web-lfi.html";
      }
    } catch {
      localStorage.removeItem(navigationStorageKey);
    }
  }

  function saveState() {
    localStorage.setItem(
      navigationStorageKey,
      JSON.stringify({
        openGroup,
        openNested,
        activePage
      })
    );
  }

  async function loadPage(pagePath) {
    const response = await fetch(pagePath);
    pageHtml = await response.text();
    activePage = pagePath;
    saveState();
    await tick();
    bindPageControls();
    updateReverseShellPayloads();
  }

  function toggleGroup(groupId) {
    openGroup = openGroup === groupId ? null : groupId;
    openNested = null;
    saveState();
  }

  async function selectSubTab(groupId, pagePath) {
    openGroup = groupId;
    openNested = null;
    await loadPage(pagePath);
  }

  function toggleNestedTab(groupId, tabId) {
    openGroup = groupId;
    openNested = openNested === tabId ? null : tabId;
    saveState();
  }

  async function selectNestedSubTab(groupId, tabId, pagePath) {
    openGroup = groupId;
    openNested = tabId;
    await loadPage(pagePath);
  }

  async function selectSingleTab(pagePath) {
    openGroup = null;
    openNested = null;
    await loadPage(pagePath);
  }

  function isSingleTabActive(tab) {
    return tab.matchPages?.includes(activePage) || activePage === tab.page;
  }

  function isGroupActive(group) {
    return group.tabs.some((tab) => isTabActive(tab));
  }

  function isTabActive(tab) {
    return tab.page === activePage || tab.children?.some((child) => child.page === activePage);
  }

  function getPayloadText(button) {
    const block = button.closest(".payload-block");
    const textElement = block?.querySelector(".copy-text");
    return textElement?.textContent.trim() || "";
  }

  function flashButton(button, text = "Copied") {
    const oldText = button.textContent;
    button.textContent = text;
    button.classList.add("copied");

    setTimeout(() => {
      button.textContent = oldText;
      button.classList.remove("copied");
    }, 900);
  }

  function updateReverseShellPayloads(sourceInput) {
    if (sourceInput?.classList.contains("rs-ip")) {
      rsState.ip = sourceInput.value.trim() || "ATTACKER_IP";
    }

    if (sourceInput?.classList.contains("rs-port")) {
      rsState.port = sourceInput.value.trim() || "4444";
    }

    document.querySelectorAll(".rs-ip").forEach((input) => {
      input.value = rsState.ip;
    });

    document.querySelectorAll(".rs-port").forEach((input) => {
      input.value = rsState.port;
    });

    document.querySelectorAll(".rs-payload").forEach((payload) => {
      const rawPayload = payload.dataset.template
        .replaceAll("{IP}", rsState.ip)
        .replaceAll("{PORT}", rsState.port);
      const encoding = payload
        .closest(".payload-block")
        ?.querySelector(".rs-encoding-select")
        ?.value || "raw";

      payload.textContent = encodeReverseShellPayload(rawPayload, encoding);
    });
  }

  function encodeReverseShellPayload(payloadText, encoding) {
    if (encoding === "url") {
      return encodeURIComponent(payloadText);
    }

    if (encoding === "base64") {
      const bytes = new TextEncoder().encode(payloadText);
      const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
      return btoa(binary);
    }

    return payloadText;
  }

  function updateReverseShellDropdown(selectElement) {
    const selectedShell = selectElement.value;

    document.querySelectorAll(".rs-shell-section").forEach((section) => {
      section.hidden = section.dataset.shell !== selectedShell;
    });
  }

  function closeCustomSelects(activeSelect) {
    document.querySelectorAll(".custom-select.open").forEach((select) => {
      if (select !== activeSelect) {
        select.classList.remove("open");
      }
    });
  }

  function syncCustomSelect(selectElement) {
    const wrapper = selectElement.nextElementSibling;

    if (!wrapper?.classList.contains("custom-select")) {
      return;
    }

    const selectedOption = selectElement.selectedOptions[0];
    const label = wrapper.querySelector(".custom-select-label");

    if (label) {
      label.textContent = selectedOption?.textContent || "";
    }

    wrapper.querySelectorAll(".custom-select-option").forEach((button) => {
      button.classList.toggle("active", button.dataset.value === selectElement.value);
    });
  }

  function enhanceCustomSelects() {
    document
      .querySelectorAll(".reverse-shell-page select.rs-select, .reverse-shell-page select.rs-encoding-select")
      .forEach((selectElement) => {
        if (selectElement.dataset.customEnhanced === "true") {
          syncCustomSelect(selectElement);
          return;
        }

        selectElement.dataset.customEnhanced = "true";
        selectElement.classList.add("native-select-hidden");

        const wrapper = document.createElement("div");
        wrapper.className = "custom-select";

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "custom-select-trigger";
        trigger.innerHTML = '<span class="custom-select-label"></span><span class="custom-select-caret">▾</span>';

        const menu = document.createElement("div");
        menu.className = "custom-select-menu";

        Array.from(selectElement.options).forEach((option) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "custom-select-option";
          item.dataset.value = option.value;
          item.textContent = option.textContent;

          item.addEventListener("click", (event) => {
            event.stopPropagation();
            selectElement.value = option.value;
            selectElement.dispatchEvent(new Event("change", { bubbles: true }));
            wrapper.classList.remove("open");
            syncCustomSelect(selectElement);
          });

          menu.appendChild(item);
        });

        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          const willOpen = !wrapper.classList.contains("open");
          closeCustomSelects(wrapper);
          wrapper.classList.toggle("open", willOpen);
        });

        selectElement.addEventListener("change", () => syncCustomSelect(selectElement));

        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);
        selectElement.insertAdjacentElement("afterend", wrapper);
        syncCustomSelect(selectElement);
      });
  }

  function bindPageControls() {
    const notesArea = document.querySelector("#notesText");
    const downloadNotesButton = document.querySelector("#downloadNotes");
    const clearNotesButton = document.querySelector("#clearNotes");
    const shellSelect = document.querySelector("#rsShellType");

    if (shellSelect) {
      updateReverseShellDropdown(shellSelect);
      shellSelect.addEventListener("change", () => updateReverseShellDropdown(shellSelect));
    }

    document.querySelectorAll(".rs-encoding-select").forEach((select) => {
      select.addEventListener("change", () => updateReverseShellPayloads());
    });

    if (notesArea) {
      notesArea.value = localStorage.getItem(notesStorageKey) || "";
      notesArea.addEventListener("input", () => {
        localStorage.setItem(notesStorageKey, notesArea.value);
      });
    }

    if (downloadNotesButton && notesArea) {
      downloadNotesButton.addEventListener("click", () => {
        const blob = new Blob([notesArea.value], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "notes.txt";
        link.click();
        URL.revokeObjectURL(link.href);
        flashButton(downloadNotesButton, "Downloaded");
      });
    }

    if (clearNotesButton && notesArea) {
      clearNotesButton.addEventListener("click", () => {
        notesArea.value = "";
        localStorage.removeItem(notesStorageKey);
        flashButton(clearNotesButton, "Cleared");
      });
    }

    document.querySelectorAll(".copy-button").forEach((button) => {
      button.addEventListener("click", async () => {
        const row = button.closest(".command-row");
        const textElement = row?.querySelector(".copy-text");
        await navigator.clipboard.writeText(textElement?.textContent.trim() || "");
        flashButton(button, "OK");
      });
    });

    document.querySelectorAll(".copy-icon:not(.url-encode-button), .copy-main").forEach((button) => {
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(getPayloadText(button));
        flashButton(button);
      });
    });

    document.querySelectorAll(".url-encode-button").forEach((button) => {
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(encodeURIComponent(getPayloadText(button)));
        flashButton(button, "Encoded");
      });
    });

    document.querySelectorAll(".rs-ip, .rs-port").forEach((input) => {
      input.addEventListener("input", () => updateReverseShellPayloads(input));
    });

    enhanceCustomSelects();

    document.querySelectorAll("[data-page-link]").forEach((button) => {
      button.addEventListener("click", async () => {
        openGroup = null;
        openNested = null;
        await loadPage(button.dataset.pageLink);
      });
    });
  }
</script>

<div class="app" data-theme="oscp">
  <aside class="sidebar-rail">
    {#each groups as group}
      <div class="tooltip tooltip-right" data-tip={group.label}>
        <button
          class="sidebar-main-tab"
          class:active={openGroup === group.id || isGroupActive(group)}
          aria-label={group.label}
          type="button"
          onclick={() => toggleGroup(group.id)}
        >
          <img class={navIconClass} src={group.icon} alt="">
        </button>
      </div>
    {/each}

    {#each singleTabs as tab}
      <div class="tooltip tooltip-right" data-tip={tab.label}>
        <button
          class="sidebar-main-tab"
          class:active={isSingleTabActive(tab)}
          aria-label={tab.label}
          type="button"
          onclick={() => selectSingleTab(tab.page)}
        >
          <img class={navIconClass} src={tab.icon} alt="">
        </button>
      </div>
    {/each}
  </aside>

  {#if activeOpenGroup}
    <aside class="sidebar-detail">
      <div class="sidebar-detail-header">
        <span>{activeOpenGroup.label}</span>
      </div>

      <div class="sidebar-subtabs">
        {#each activeOpenGroup.tabs as tab}
          <div class="sidebar-subgroup">
            <button
              class="sidebar-subtab"
              class:active={isTabActive(tab)}
              type="button"
              onclick={() => tab.children ? toggleNestedTab(activeOpenGroup.id, tab.id) : selectSubTab(activeOpenGroup.id, tab.page)}
            >
              {tab.label}
            </button>

            {#if tab.children && openNested === tab.id}
              <div class="sidebar-child-tabs">
                {#each tab.children as child}
                  <button
                    class="sidebar-child-tab"
                    class:active={activePage === child.page}
                    type="button"
                    onclick={() => selectNestedSubTab(activeOpenGroup.id, tab.id, child.page)}
                  >
                    {child.label}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </aside>
  {/if}

  <main class="flex min-w-0 flex-1 flex-col bg-base-200">
    <header class="flex h-[58px] shrink-0 items-center justify-between border-b border-primary/15 bg-[#111214] px-5">
      <div class="min-w-0">
        <div class="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Red Team Field Kit</div>
        <div class="mt-1 flex items-center gap-2 text-sm text-base-content">
          <span class="truncate font-semibold">{getActiveMeta().label}</span>
          <span class="h-1 w-1 rounded-full bg-primary"></span>
          <span class="truncate text-xs text-base-content/60">{getActiveMeta().phase}</span>
        </div>
      </div>

      <div class="badge badge-outline border-primary/35 px-3 text-[10px] uppercase tracking-[0.18em] text-primary">
        {getActiveMeta().section}
      </div>
    </header>

    <section id="content" class="content">
      {@html pageHtml}
    </section>
  </main>
</div>
