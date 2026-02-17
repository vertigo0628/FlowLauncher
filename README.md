# 📘 Design Review: FlowLauncher

> **Project Name:** FlowLauncher (vertigo0628)  
> **Platform:** Android
> **Core Framework:** .NET Core / C#  
> **Review Status:** System Architecture Baseline  

---

## 1. Project Mission
FlowLauncher is a keystroke-driven productivity interface designed to replace the native Windows Start Menu. It serves as a central command center that aggregates local file search, system commands, and web API queries into a unified query bar.

* **Primary Goal:** Minimize user time-to-action via keyboard-centric workflows.
* **UX Paradigm:** "Type-to-act" (Input $\rightarrow$ Query $\rightarrow$ Execution).
* **Extensibility:** Modular architecture allowing third-party integration via plugins.

---

## 2. System Architecture
The application operates as a **host kernel** that loads isolated plugin assemblies.

```mermaid
graph TD
    Host[FlowLauncher Kernel (WPF)] -->|IPC/JSON-RPC| Plugins[Plugin Manager]
    Plugins --> Py[Python Plugins]
    Plugins --> CS[C# / .NET Plugins]
    Host --> Index[Search Indexer]
    Index <--> FileSys[NTFS / Everything SDK]
    Host --> UI[WPF Presentation Layer]
