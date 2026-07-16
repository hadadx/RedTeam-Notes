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
      page: "pages/recon-intelligence-gathering.html",
      tabs: [
        {
          id: "osint",
          label: "OSINT",
          shortLabel: "OS",
          phase: "OSINT",
          icon: "icons/osint-icon.png",
          children: [
            { label: "Dorking", page: "pages/recon-osint-dorking.html" }
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
      label: "Web Testing",
      phase: "Exploitation",
      icon: "icons/owasp-symbol-icon.png",
      tabs: [
        { id: "lfi", label: "LFI", shortLabel: "LFI", phase: "File Inclusion", page: "pages/web-lfi.html" },
        { id: "sqli", label: "SQL Injection", shortLabel: "SQL", phase: "Injection", page: "pages/web-sqli.html" },
        { id: "xss", label: "XSS", shortLabel: "XSS", phase: "Client-Side", page: "pages/web-xss.html" }
      ]
    },
    {
      id: "ad",
      label: "Active Directory",
      phase: "Internal",
      icon: "icons/ad-icon.png",
      page: "pages/active-directory.html",
      tabs: [
        {
          id: "ad-info-resource",
          label: "Information Resource",
          shortLabel: "INFO",
          phase: "Resources",
          page: "pages/ad-information-resource.html",
          children: [
            {
              id: "ad-auth-method",
              label: "Authentication Method",
              phase: "Authentication",
              page: "pages/ad-authentication-method.html",
              children: [
                { label: "NTLM", page: "pages/ad-authentication-ntlm.html" },
                { label: "Kerberos", page: "pages/ad-authentication-kerberos.html" }
              ]
            }
          ]
        },
        { id: "ad-enum", label: "Enumeration", shortLabel: "ENUM", phase: "Enumeration", page: "pages/ad-enumeration.html" },
        {
          id: "ad-auth-attacks",
          label: "Authentication Attacks",
          shortLabel: "AUTH",
          phase: "Authentication",
          page: "pages/ad-authentication-attacks.html",
          children: [
            {
              id: "ad-password-spraying",
              label: "Password Spraying",
              page: "pages/ad-password-spraying.html",
              children: [
                { label: "Using Spray-Passwords.ps1", page: "pages/ad-spray-passwords-ps1.html" },
                { label: "Using NetExec", page: "pages/ad-password-spraying-netexec.html" },
                { label: "Using Kerbrute", page: "pages/ad-password-spraying-kerbrute.html" }
              ]
            },
            {
              id: "ad-as-rep-roasting",
              label: "AS-REP Roasting",
              page: "pages/ad-as-rep-roasting.html",
              children: [
                { label: "Using impacket-GetNPUsers", page: "pages/ad-as-rep-roasting-getnpusers.html" },
                { label: "Using Rubeus", page: "pages/ad-as-rep-roasting-rubeus.html" }
              ]
            },
            {
              id: "ad-kerberoasting",
              label: "Kerberoasting",
              page: "pages/ad-kerberoasting.html",
              children: [
                { label: "Using Rubeus", page: "pages/ad-kerberoasting-rubeus.html" },
                { label: "Using impacket-GetUserSPNs", page: "pages/ad-kerberoasting-getuserspns.html" }
              ]
            },
            {
              id: "ad-silver-tickets",
              label: "Silver Tickets",
              page: "pages/ad-silver-tickets.html",
              children: [
                { label: "Flow Use Mimikatz", page: "pages/ad-silver-tickets-mimikatz.html" }
              ]
            },
            {
              id: "ad-dcsync",
              label: "DCSync",
              page: "pages/ad-dcsync.html",
              children: [
                { label: "Using Mimikatz", page: "pages/ad-dcsync-mimikatz.html" },
                { label: "Using impacket-secretsdump", page: "pages/ad-dcsync-secretsdump.html" }
              ]
            }
          ]
        },
        {
          id: "ad-lateral-movement",
          label: "Lateral Movement",
          shortLabel: "MOVE",
          phase: "Movement",
          page: "pages/ad-lateral-movement.html",
          children: [
            {
              label: "WMI",
              page: "pages/ad-lateral-movement-wmi.html",
              children: [
                { label: "wmic.exe", page: "pages/ad-lateral-movement-wmic.html" },
                { label: "CIM", page: "pages/ad-lateral-movement-cim-ps.html" }
              ]
            },
            {
              label: "WinRM",
              page: "pages/ad-lateral-movement-winrm.html",
              children: [
                { label: "winrs.exe", page: "pages/ad-lateral-movement-winrs.html" },
                { label: "PSSession", page: "pages/ad-lateral-movement-pssession.html" }
              ]
            },
            { label: "PsExec", page: "pages/ad-lateral-movement-psexec.html" },
            {
              label: "PtH",
              page: "pages/ad-lateral-movement-pth.html",
              children: [
                { label: "impacket-wmiexec", page: "pages/ad-lateral-movement-pth-wmiexec.html" }
              ]
            },
            {
              label: "OtH",
              page: "pages/ad-lateral-movement-oth.html",
              children: [
                { label: "mimikatz + psexec", page: "pages/ad-lateral-movement-oth-mimikatz-psexec.html" }
              ]
            },
            {
              label: "PtT",
              page: "pages/ad-lateral-movement-ptt.html",
              children: [
                { label: "mimikatz", page: "pages/ad-lateral-movement-ptt-mimikatz.html" }
              ]
            },
            { label: "DCOM", page: "pages/ad-lateral-movement-dcom.html" }
          ]
        },
        {
          id: "ad-persistence",
          label: "Persistence",
          shortLabel: "PERS",
          phase: "Persistence",
          page: "pages/ad-persistence.html",
          children: [
            { label: "Golden Ticket", page: "pages/ad-persistence-golden-ticket.html" },
            { label: "Shadow Copy", page: "pages/ad-persistence-shadow-copy.html" }
          ]
        }
      ]
    },
    {
      id: "linux",
      label: "Linux Commands",
      phase: "Post-Exploitation",
      icon: "icons/linux-icon.png",
      page: "pages/linux-commands.html",
      tabs: [
        {
          id: "linux-info-resource",
          label: "Information Resource",
          shortLabel: "INFO",
          phase: "Resources",
          page: "pages/linux-information-resource.html"
        },
        {
          id: "linux-enum",
          label: "Enumeration",
          shortLabel: "ENUM",
          phase: "Enumeration",
          page: "pages/linux-enumeration.html"
        }
      ]
    },
    {
      id: "windows",
      label: "Windows",
      phase: "Post-Exploitation",
      icon: "icons/windows-icon.png",
      page: "pages/windows.html",
      tabs: [
        {
          id: "windows-info-resource",
          label: "Information Resource",
          shortLabel: "INFO",
          phase: "Resources",
          page: "pages/windows-information-resource.html"
        },
        {
          id: "windows-enum",
          label: "Enumeration",
          shortLabel: "ENUM",
          phase: "Enumeration",
          page: "pages/windows-enumeration.html"
        }
      ]
    }
  ];

  const singleTabs = [
    { label: "Reverse Shell", phase: "Payloads", page: "pages/reverse-shells.html", icon: "icons/reverse-shell-icon.png" },
    { label: "Notes", phase: "Workspace", page: "pages/notes.html", icon: "icons/notes-icon.png" }
  ];

  const pageMeta = {
    "pages/reconnaissance.html": { section: "Discovery", phase: "Field Kit", label: "Reconnaissance" },
    "pages/recon-intelligence-gathering.html": { section: "Reconnaissance", phase: "Overview", label: "Reconnaissance" },
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
    "pages/web-vuln.html": { section: "Exploitation", phase: "Web Testing", label: "Web Testing" },
    "pages/web-lfi.html": { section: "Web Testing", phase: "File Inclusion", label: "LFI" },
    "pages/web-sqli.html": { section: "Web Testing", phase: "Injection", label: "SQL Injection" },
    "pages/web-xss.html": { section: "Web Testing", phase: "Client-Side", label: "XSS" },
    "pages/active-directory.html": { section: "Active Directory", phase: "Overview", label: "Active Directory" },
    "pages/ad-information-resource.html": { section: "Active Directory", phase: "Resources", label: "Information Resource" },
    "pages/ad-authentication-method.html": { section: "Active Directory", phase: "Authentication", label: "Authentication Method" },
    "pages/ad-authentication-ntlm.html": { section: "Active Directory", phase: "Authentication", label: "NTLM" },
    "pages/ad-authentication-kerberos.html": { section: "Active Directory", phase: "Authentication", label: "Kerberos" },
    "pages/ad-enumeration.html": { section: "Active Directory", phase: "Enumeration", label: "Enumeration" },
    "pages/ad-lateral-movement.html": { section: "Active Directory", phase: "Movement", label: "Lateral Movement" },
    "pages/ad-authentication-attacks.html": { section: "Active Directory", phase: "Authentication", label: "Authentication Attacks" },
    "pages/ad-password-spraying.html": { section: "Active Directory", phase: "Authentication Attacks", label: "Password Spraying" },
    "pages/ad-spray-passwords-ps1.html": { section: "Active Directory", phase: "Password Spraying", label: "Using Spray-Passwords.ps1" },
    "pages/ad-password-spraying-netexec.html": { section: "Active Directory", phase: "Password Spraying", label: "Using NetExec" },
    "pages/ad-password-spraying-kerbrute.html": { section: "Active Directory", phase: "Password Spraying", label: "Using Kerbrute" },
    "pages/ad-as-rep-roasting.html": { section: "Active Directory", phase: "Authentication Attacks", label: "AS-REP Roasting" },
    "pages/ad-as-rep-roasting-getnpusers.html": { section: "Active Directory", phase: "AS-REP Roasting", label: "Using impacket-GetNPUsers" },
    "pages/ad-as-rep-roasting-rubeus.html": { section: "Active Directory", phase: "AS-REP Roasting", label: "Using Rubeus" },
    "pages/ad-kerberoasting.html": { section: "Active Directory", phase: "Authentication Attacks", label: "Kerberoasting" },
    "pages/ad-kerberoasting-rubeus.html": { section: "Active Directory", phase: "Kerberoasting", label: "Using Rubeus" },
    "pages/ad-kerberoasting-getuserspns.html": { section: "Active Directory", phase: "Kerberoasting", label: "Using impacket-GetUserSPNs" },
    "pages/ad-silver-tickets.html": { section: "Active Directory", phase: "Authentication Attacks", label: "Silver Tickets" },
    "pages/ad-silver-tickets-mimikatz.html": { section: "Active Directory", phase: "Silver Tickets", label: "Flow Use Mimikatz" },
    "pages/ad-dcsync.html": { section: "Active Directory", phase: "Authentication Attacks", label: "DCSync" },
    "pages/ad-dcsync-mimikatz.html": { section: "Active Directory", phase: "DCSync", label: "Using Mimikatz" },
    "pages/ad-dcsync-secretsdump.html": { section: "Active Directory", phase: "DCSync", label: "Using impacket-secretsdump" },
    "pages/ad-lateral-movement-wmi.html": { section: "Active Directory", phase: "Lateral Movement", label: "WMI" },
    "pages/ad-lateral-movement-wmic.html": { section: "Active Directory", phase: "WMI", label: "wmic.exe" },
    "pages/ad-lateral-movement-cim-ps.html": { section: "Active Directory", phase: "WMI", label: "CIM" },
    "pages/ad-lateral-movement-winrm.html": { section: "Active Directory", phase: "Lateral Movement", label: "WinRM" },
    "pages/ad-lateral-movement-winrs.html": { section: "Active Directory", phase: "WinRM", label: "winrs.exe" },
    "pages/ad-lateral-movement-pssession.html": { section: "Active Directory", phase: "WinRM", label: "PSSession" },
    "pages/ad-lateral-movement-psexec.html": { section: "Active Directory", phase: "Lateral Movement", label: "PsExec" },
    "pages/ad-lateral-movement-pth.html": { section: "Active Directory", phase: "Lateral Movement", label: "PtH" },
    "pages/ad-lateral-movement-pth-wmiexec.html": { section: "Active Directory", phase: "PtH", label: "impacket-wmiexec" },
    "pages/ad-lateral-movement-oth.html": { section: "Active Directory", phase: "Lateral Movement", label: "Overpass-the-Hash" },
    "pages/ad-lateral-movement-oth-mimikatz-psexec.html": { section: "Active Directory", phase: "Overpass-the-Hash", label: "mimikatz + psexec" },
    "pages/ad-lateral-movement-ptt.html": { section: "Active Directory", phase: "Lateral Movement", label: "Pass-the-Ticket" },
    "pages/ad-lateral-movement-ptt-mimikatz.html": { section: "Active Directory", phase: "Pass-the-Ticket", label: "mimikatz" },
    "pages/ad-lateral-movement-dcom.html": { section: "Active Directory", phase: "Lateral Movement", label: "DCOM" },
    "pages/ad-persistence.html": { section: "Active Directory", phase: "Persistence", label: "Persistence" },
    "pages/ad-persistence-golden-ticket.html": { section: "Active Directory", phase: "Persistence", label: "Golden Ticket" },
    "pages/ad-persistence-shadow-copy.html": { section: "Active Directory", phase: "Persistence", label: "Shadow Copy" },
    "pages/linux-commands.html": { section: "Linux Commands", phase: "Overview", label: "Linux Commands" },
    "pages/linux-information-resource.html": { section: "Linux Commands", phase: "Resources", label: "Information Resource" },
    "pages/linux-enumeration.html": { section: "Linux Commands", phase: "Enumeration", label: "Enumeration" },
    "pages/windows.html": { section: "Windows", phase: "Overview", label: "Windows" },
    "pages/windows-information-resource.html": { section: "Windows", phase: "Resources", label: "Information Resource" },
    "pages/windows-enumeration.html": { section: "Windows", phase: "Enumeration", label: "Enumeration" }
  };

  const primaryGroups = groups.filter((group) => !["linux", "ad", "windows"].includes(group.id));
  const secondaryGroups = ["linux", "windows", "ad"]
    .map((id) => groups.find((group) => group.id === id))
    .filter(Boolean);

  const navIconClass = "block h-[29px] w-[29px] object-contain";
  const subIconClass = "block h-[21px] w-[21px] object-contain";

  function navIconFor(item) {
    return item.label === "Active Directory"
      ? "block h-[35px] w-[35px] scale-110 object-contain"
      : navIconClass;
  }

  function getNavId(item) {
    return item.id ?? item.page ?? item.label;
  }

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

  function getActiveMeta(pagePath) {
    if (pageMeta[pagePath]) {
      return pageMeta[pagePath];
    }

    for (const group of groups) {
      for (const tab of group.tabs) {
        if (tab.page === pagePath) {
          return {
            section: group.label,
            phase: tab.phase ?? group.phase,
            label: tab.label
          };
        }

        const child = tab.children?.find((item) => item.page === pagePath || item.children?.some((nestedItem) => nestedItem.page === pagePath));

        if (child) {
          const nestedItem = child.children?.find((item) => item.page === pagePath);

          return {
            section: group.label,
            phase: nestedItem ? child.label : child.phase ?? tab.phase ?? group.phase,
            label: nestedItem?.label ?? child.label
          };
        }
      }
    }

    const singleTab = singleTabs.find((tab) => tab.page === pagePath || tab.matchPages?.includes(pagePath));

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
  let openNested = null;
  let openDeepNested = null;
  let activePage = "pages/recon-intelligence-gathering.html";
  let pageHtml = "";
  let rsState = {
    ip: "192.168.45.166",
    port: "4444"
  };

  $: activeOpenGroup = groups.find((group) => group.id === openGroup);
  $: activeMeta = getActiveMeta(activePage);

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
      openDeepNested = parsedState.openDeepNested ?? openDeepNested;
      activePage = parsedState.activePage ?? activePage;

      if (activePage?.startsWith("pages/rs-")) {
        openGroup = null;
        openNested = null;
        openDeepNested = null;
        activePage = "pages/reverse-shells.html";
      }

      if (activePage === "pages/reconnaissance.html") {
        openGroup = "recon";
        openNested = null;
        openDeepNested = null;
        activePage = "pages/recon-intelligence-gathering.html";
      }

      if (activePage === "pages/web-vuln.html") {
        openGroup = null;
        openNested = null;
        openDeepNested = null;
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
        openDeepNested,
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
    openDeepNested = null;
    saveState();
  }

  async function selectGroup(group) {
    openGroup = group.id;
    openNested = null;
    openDeepNested = null;

    if (group.page) {
      await loadPage(group.page);
      return;
    }

    saveState();
  }

  async function selectSubTab(groupId, pagePath) {
    openGroup = groupId;
    openNested = null;
    openDeepNested = null;
    await loadPage(pagePath);
  }

  async function toggleNestedTab(groupId, tabId, pagePath) {
    openGroup = groupId;
    openNested = openNested === tabId ? null : tabId;
    openDeepNested = null;

    if (pagePath) {
      await loadPage(pagePath);
      return;
    }

    saveState();
  }

  async function selectNestedSubTab(groupId, tabId, pagePath) {
    openGroup = groupId;
    openNested = tabId;
    openDeepNested = null;
    await loadPage(pagePath);
  }

  async function toggleDeepNestedTab(groupId, tabId, childId, pagePath) {
    openGroup = groupId;
    openNested = tabId;
    openDeepNested = openDeepNested === childId ? null : childId;

    if (pagePath) {
      await loadPage(pagePath);
      return;
    }

    saveState();
  }

  async function selectDeepNestedSubTab(groupId, tabId, childId, pagePath) {
    openGroup = groupId;
    openNested = tabId;
    openDeepNested = childId;
    await loadPage(pagePath);
  }

  async function selectSingleTab(pagePath) {
    openGroup = null;
    openNested = null;
    openDeepNested = null;
    await loadPage(pagePath);
  }

  function isSingleTabActive(tab) {
    return tab.matchPages?.includes(activePage) || activePage === tab.page;
  }

  function isGroupActive(group) {
    return group.page === activePage || group.tabs.some((tab) => isTabActive(tab));
  }

  function isTabActive(tab) {
    return tab.page === activePage || tab.children?.some((child) => child.page === activePage || child.children?.some((item) => item.page === activePage));
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

  function closeImagePreview() {
    document.querySelector(".image-preview")?.remove();
    document.removeEventListener("keydown", closeImagePreviewOnEscape);
  }

  function closeImagePreviewOnEscape(event) {
    if (event.key === "Escape") {
      closeImagePreview();
    }
  }

  function openImagePreview(image) {
    closeImagePreview();

    const preview = document.createElement("div");
    preview.className = "image-preview";
    preview.innerHTML = `
      <button class="image-preview-close" type="button" aria-label="Close image preview">x</button>
      <img src="${image.src}" alt="${image.alt || ""}">
    `;

    preview.addEventListener("click", (event) => {
      if (event.target === preview || event.target.closest(".image-preview-close")) {
        closeImagePreview();
      }
    });

    document.body.appendChild(preview);
    document.addEventListener("keydown", closeImagePreviewOnEscape);
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
        openDeepNested = null;
        await loadPage(button.dataset.pageLink);
      });
    });

    document.querySelectorAll(".content-image img").forEach((image) => {
      image.addEventListener("click", () => openImagePreview(image));
    });
  }
</script>

<div class="app" data-theme="oscp">
  <aside class="sidebar-rail">
    {#each primaryGroups as group}
      <div class="tooltip tooltip-right" data-tip={group.label}>
        <button
          class="sidebar-main-tab"
          class:active={openGroup === group.id}
          aria-label={group.label}
          type="button"
          onclick={() => selectGroup(group)}
        >
          <img class={navIconFor(group)} src={group.icon} alt="">
        </button>
      </div>
    {/each}

    {#each singleTabs.slice(0, 1) as tab}
      <div class="tooltip tooltip-right" data-tip={tab.label}>
        <button
          class="sidebar-main-tab"
          class:active={isSingleTabActive(tab)}
          aria-label={tab.label}
          type="button"
          onclick={() => selectSingleTab(tab.page)}
        >
          <img class={navIconFor(tab)} src={tab.icon} alt="">
        </button>
      </div>
    {/each}

    {#each secondaryGroups as group}
      <div class="tooltip tooltip-right" data-tip={group.label}>
        <button
          class="sidebar-main-tab"
          class:active={openGroup === group.id}
          aria-label={group.label}
          type="button"
          onclick={() => selectGroup(group)}
        >
          <img class={navIconFor(group)} src={group.icon} alt="">
        </button>
      </div>
    {/each}

    {#each singleTabs.slice(1) as tab}
      <div class="tooltip tooltip-right" data-tip={tab.label}>
        <button
          class="sidebar-main-tab"
          class:active={isSingleTabActive(tab)}
          aria-label={tab.label}
          type="button"
          onclick={() => selectSingleTab(tab.page)}
        >
          <img class={navIconFor(tab)} src={tab.icon} alt="">
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
              onclick={() => tab.children ? toggleNestedTab(activeOpenGroup.id, tab.id, tab.page) : selectSubTab(activeOpenGroup.id, tab.page)}
            >
              {tab.label}
            </button>

            {#if tab.children && openNested === tab.id}
              <div class="sidebar-child-tabs">
                {#each tab.children as child}
                  <button
                    class="sidebar-child-tab"
                    class:active={activePage === child.page || child.children?.some((item) => item.page === activePage)}
                    type="button"
                    onclick={() => child.children ? toggleDeepNestedTab(activeOpenGroup.id, tab.id, getNavId(child), child.page) : selectNestedSubTab(activeOpenGroup.id, tab.id, child.page)}
                  >
                    {child.label}
                  </button>

                  {#if child.children && openDeepNested === getNavId(child)}
                    <div class="sidebar-grandchild-tabs">
                      {#each child.children as item}
                        <button
                          class="sidebar-grandchild-tab"
                          class:active={activePage === item.page}
                          type="button"
                          onclick={() => selectDeepNestedSubTab(activeOpenGroup.id, tab.id, getNavId(child), item.page)}
                        >
                          {item.label}
                        </button>
                      {/each}
                    </div>
                  {/if}
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
        <div class="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Red Team Notes</div>
        <div class="mt-1 flex items-center gap-2 text-sm text-base-content">
          <span class="truncate font-semibold">{activeMeta.label}</span>
          <span class="h-1 w-1 rounded-full bg-primary"></span>
          <span class="truncate text-xs text-base-content/60">{activeMeta.phase}</span>
        </div>
      </div>

      <div class="badge badge-outline border-primary/35 px-3 text-[10px] uppercase tracking-[0.18em] text-primary">
        {activeMeta.section}
      </div>
    </header>

    <section id="content" class="content">
      {@html pageHtml}
    </section>
  </main>
</div>
