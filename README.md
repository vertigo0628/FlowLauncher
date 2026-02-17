# 📱 Preliminary Design Review (PDR): FlowLauncher (Android)

> **Project Name:** FlowLauncher Mobile  
> **Platform:** Android OS  
> **Core Framework:** Kotlin / Java  
> **Review Status:** Mobile Architecture Baseline  

---

## 1. Project Mission
FlowLauncher for Android is a minimal, performance-first app launcher designed to replace the cluttered home screen. It focuses on a "Search-First" user experience, allowing users to launch apps, contacts, and web queries through a unified text input.

* **Primary Goal:** Sub-second app indexing and launch.
* **UX Paradigm:** Minimalist list-view with a persistent keyboard focus.
* **Extensibility:** Support for custom "Search Providers" and shortcut actions.

---

## 2. System Architecture
The app operates as a high-priority **Home Activity** that interfaces directly with the Android `LauncherApps` and `PackageManager` APIs.



### Component Breakdown
* **UI Layer:** A lightweight `RecyclerView` or `Compose` list that renders search results in real-time.
* **Search Engine:** A local filtering engine that uses fuzzy matching (Prefix or Levenshtein) to sort apps by usage and relevance.
* **Provider System:** Modular logic blocks that fetch data from different sources (Apps, Contacts, Web, System Settings).

---

## 3. Technical Requirements Mapping

| Requirement | Status | Implementation |
| :--- | :--- | :--- |
| **App Querying** | ✅ ACTIVE | `PackageManager.queryIntentActivities()` |
| **Fuzzy Matching** | ✅ ACTIVE | Kotlin-based string filtering logic |
| **Custom Themes** | 🟡 IN PROGRESS | Material 3 / Dynamic Color support |
| **Usage Ranking** | 🟡 IN PROGRESS | Local SQLite/Room DB for frequency tracking |
| **Widget Support** | 🔴 PLANNING | `AppWidgetHost` integration |

---

## 4. Interface Control (Provider Contract)
To add new search sources, the system uses a standard `SearchProvider` interface:

```kotlin
interface SearchProvider {
    val id: String
    fun getResults(query: String): List<SearchResult>
    fun onResultClick(result: SearchResult)
}
