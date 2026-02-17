# 🌐 Preliminary Design Review (PDR): FlowLauncher (Web)

> **Project Name:** FlowLauncher Web  
> **Platform:** Web Browser (SaaS/Self-Hosted)  
> **Core Tech:** HTML/CSS/JS (React/Vue/Svelte)  
> **Review Status:** Web Architecture Baseline  

---

## 1. Project Mission
FlowLauncher Web is a browser-centric productivity portal. It acts as a primary dashboard or "New Tab" replacement that allows users to navigate the web, trigger search queries, and manage bookmarks using a unified, keyboard-driven interface.

* **Primary Goal:** To provide a "Command Palette" experience for the browser.
* **UX Paradigm:** Instant-access overlay with fuzzy search.
* **Architecture:** Client-side heavy with optional REST/GraphQL backend for syncing.

---

## 2. System Architecture
The application is a **Single Page Application (SPA)** that uses a centralized state manager to filter through searchable data "nodes."



### Component Breakdown
* **View Layer:** A responsive UI designed for speed; usually centered with a focus on the `<input>` element.
* **Query Engine:** A client-side filtering library (like Fuse.js) that handles fuzzy matching on the local data store.
* **API Integrations:** Fetch modules that call external search engines (Google/DuckDuckGo) or custom API endpoints.

---

## 3. Technical Requirements Mapping

| Requirement | Status | Implementation |
| :--- | :--- | :--- |
| **Fuzzy Search** | ✅ ACTIVE | Fuse.js / Custom Regex filtering |
| **Hotkeys** | ✅ ACTIVE | `keydown` event listeners (e.g., `Ctrl+K`) |
| **Persistence** | 🟡 IN PROGRESS | `localStorage` or IndexedDB |
| **Web Extensions** | 🔴 PLANNING | Manifest v3 for browser integration |

---

## 4. Interface Control (Command Payload)
All searchable items in the Web version are treated as "Command Objects":

```json
{
  "id": "search-google",
  "title": "Search Google",
  "subtitle": "Query Google for your search term",
  "category": "Search",
  "url_template": "[https://google.com/search?q=](https://google.com/search?q=){query}",
  "icon": "google-logo.svg"
}
