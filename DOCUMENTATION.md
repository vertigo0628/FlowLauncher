
# Flow Launcher - Project Documentation

ThThis document provides a detailed overview of the Flow Launcher web application prototype and a comprehensive guide on how to migrate it to a native Android application using Kotlin and Jetpack Compose.
is document provides a detailed overview of the Flow Launcher web application prototype and a comprehensive guide on how to migrate it to a native Android application using Kotlin and Jetpack Compose.

---

## Part 1: Web App Prototype Documentation

### 1.1. Overview

Flow Launcher is a web-based prototype designed to simulate an intelligent, AI-powered mobile home screen launcher. It prioritizes a clean, minimalist design and showcases several AI-driven features to enhance user experience. The entire application is built using a modern web stack and runs in a browser.

### 1.2. Core Features

-   **Modular Home Screen**: The main screen is composed of several widgets, including a live clock, a weather display, and AI-driven content.
-   **Gesture Navigation**:
    -   **Swipe Up**: Opens a full-screen App Drawer.
    -   **Swipe Down**: Opens a Universal Search panel.
-   **Flower Menu**: A radial menu provides quick, one-handed access to categorized app collections. It's an alternative to a traditional static app dock.
-   **App Drawer**: A scrollable grid displaying all "installed" applications, complete with its own search functionality.
-   **Search Panel**: A universal search interface that uses AI to provide results from apps, contacts, and the web.
-   **Theming**: Supports both light and dark themes, with a manual toggle. The theme is persisted in the browser's local storage.

### 1.3. UI/UX and Style Guide

-   **Primary Color**: Slate Blue (`hsl(210, 14%, 56%)`). Used for primary interactive elements like the main voice assistant button and the Flower Menu button.
-   **Background Color**: Light Gray (`#D3D3D3`). Used as the main wallpaper/backdrop for the home screen.
-   **Accent Color**: Soft Purple (`hsl(255, 38%, 75%)`). Used for the category icons in the Flower Menu.
-   **Font**: 'Inter' (sans-serif) is used for all body and headline text to maintain a modern and readable interface.
-   **Component Library**: The UI is built with ShadCN UI, providing a consistent and clean aesthetic for components like buttons, dialogs, and cards.
-   **Animations**: Framer Motion is used for smooth, subtle animations on UI elements like the clock, voice assistant button, and panel transitions to enhance the user experience.

### 1.4. AI-Powered Features (Genkit Flows)

The application's intelligence is powered by Google's Genkit, which orchestrates calls to Large Language Models (LLMs).

-   **`auto-app-categorization`**:
    -   **Purpose**: To automatically classify a list of installed apps into predefined categories (e.g., Social, Media, Games).
    -   **Mechanism**: It sends a list of app names to an LLM with a prompt that instructs it to return a categorized list. This is used to populate the Flower Menu.
-   **`intelligent-app-suggestions`**:
    -   **Purpose**: To provide a list of contextually relevant apps.
    -   **Mechanism**: The flow sends the time of day, user location (mocked), and usage patterns (mocked) to an LLM. The model returns a list of suggested apps from the user's installed list.
-   **`daily-briefing`**:
    -   **Purpose**: To generate a concise, human-readable summary of the user's day.
    -   **Mechanism**: This flow aggregates data from other services (weather, mocked calendar events, and app suggestions) and passes it to an LLM. The model then synthesizes this information into a friendly briefing.
-   **`universal-search`**:
    -   **Purpose**: To provide multi-category search results from a single query.
    -   **Mechanism**: Takes a user's search query, a list of installed apps, and a list of contacts. The LLM then determines if the query matches an app or contact, and also generates relevant web search suggestions.
-   **`command-parser`**:
    -   **Purpose**: To power the voice assistant by determining user intent from a voice command.
    -   **Mechanism**: This is the core of the voice assistant. It takes the transcribed text from the user's speech and analyzes it to identify an `intent` (e.g., `launch_app`, `toggle_setting`) and any `entities` (e.g., the app name or setting name). It also generates a natural language response.

### 1.5. Technical Stack

-   **Framework**: Next.js (React)
-   **AI**: Google Genkit with a Gemini backend
-   **Styling**: Tailwind CSS with ShadCN UI components
-   **Animation**: Framer Motion
-   **Speech Recognition**: `react-speech-recognition` (browser-based)
-   **Language**: TypeScript

### 1.6. Project Structure

```
.
├── src/
│   ├── app/                # Main Next.js pages and layout
│   │   ├── page.tsx        # The entry point and main server component for the home screen
│   │   └── layout.tsx      # Root layout of the application
│   ├── ai/                 # All Genkit-related code
│   │   ├── flows/          # Individual AI flows for each feature
│   │   ├── genkit.ts       # Genkit initialization
│   │   └── types.ts        # Zod schemas and TypeScript types for AI flows
│   ├── components/
│   │   ├── launcher/       # Components specific to the Flow Launcher UI
│   │   └── ui/             # Reusable ShadCN UI components
│   ├── lib/                # Shared utilities, constants, and types
│   │   ├── apps.ts         # Mock data for installed applications
│   │   └── utils.ts        # General utility functions
│   └── hooks/              # Custom React hooks
└── DOCUMENTATION.md        # This file
```

---

## Part 2: Guide to Building a Native Android Version

This guide outlines the process of translating the web prototype into a native Android application using modern, recommended practices. It is structured to be used as a detailed prompt for a generative AI agent familiar with Android development.

### 2.1. Foundational Setup

-   **IDE**: Android Studio
-   **Language**: Kotlin
-   **UI Toolkit**: Jetpack Compose
-   **Architecture**: MVVM (Model-View-ViewModel) with Kotlin Coroutines and Flow for asynchronous operations.

### 2.2. Translating UI Components (Web -> Jetpack Compose)

The core principle is to map each React component to a Jetpack Compose `@Composable` function.

| Web Component (`.tsx`)        | Jetpack Compose Equivalent                                                                                                                                                             | Key Implementation Details                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`PhoneShell`**              | The main `Activity` with `setContent`                                                                                                                                                  | Use a `MaterialTheme` Composable to define colors (light/dark) and typography. The phone "bezel" is not needed, as this will be a real app.                                        |
| **`HomeScreen`**              | `HomeScreen` Composable with a `Scaffold`                                                                                                                                              | `Scaffold` provides standard layout slots. The main content would go in the `content` slot, and you could place a custom bottom bar in the `bottomBar` slot.                      |
| **`ClockWidget`**             | `ClockWidget` Composable                                                                                                                                                               | Use `Text` to display the time. Use a `LaunchedEffect` with `delay(1000)` inside a loop to update the time state every second, which will trigger recomposition.                   |
| **`WeatherWidget`**           | `WeatherWidget` Composable                                                                                                                                                             | A `Row` containing an `Icon` and `Text`. Data will be observed from a `ViewModel` as a `State<WeatherInfo>`. Use a real weather API (e.g., OpenWeatherMap).                   |
| **`FlowerMenu`**              | `FlowerMenu` Composable                                                                                                                                                                | Use a `Box` Composable. For each category, calculate its position using `Modifier.offset` with `x` and `y` values derived from `cos(angle)` and `sin(angle)`. Animate visibility and position using `AnimatedVisibility` or the `animate*AsState` APIs. |
| **`AppDrawer` / `SearchPanel`** | `ModalBottomSheetLayout`                                                                                                                                                               | This is the native equivalent of a swipe-up/down panel. You can define the sheet's content (e.g., your app grid or search results) and the main screen content separately.         |
| **`AppIcon`**                 | `AppIcon` Composable                                                                                                                                                                   | A `Column` with an `Image` (using the Coil or Glide library to load app icons) and a `Text`. Make it clickable with `Modifier.clickable`.                                        |
| **`AppSuggestions`**          | `LazyRow` or `FlowRow`                                                                                                                                                                 | `LazyRow` is efficient for displaying a horizontal list of suggested apps. Data would be provided by a ViewModel.                                                                    |
| **`VoiceAssistantWidget`**    | `VoiceAssistantWidget` Composable                                                                                                                                                      | The UI part is a `Button` with an `Icon`. The logic behind it will be significantly different (see section 2.3).                                                                   |

### 2.3. Implementing Logic & AI (Web -> Native Android)

This is the most significant part of the migration, as we move from cloud-based AI to on-device processing.

#### 1. Fetching Installed Apps
Instead of a static list (`apps.ts`), you will query the system directly.
-   **API**: Use `PackageManager.queryIntentActivities()` to get a list of all launchable apps.
-   **Permission**: You'll need the `<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />` permission in your `AndroidManifest.xml` for Android 11+.
-   **Data**: From the `ResolveInfo` object for each app, you can get its name (`loadLabel`), package name, and icon (`loadIcon`).

#### 2. Handling Gestures
-   **API**: On your main `HomeScreen` Composable, use the `Modifier.pointerInput` with `detectDragGestures`.
-   **Logic**: Analyze the `onDrag` amount. A significant negative `y` change is a swipe up (open bottom sheet), and a significant positive `y` change is a swipe down.

#### 3. Re-implementing AI (Genkit -> On-Device ML)

The Genkit prompts serve as a blueprint for what your on-device models need to accomplish. You'll need to train or use pre-trained models for each AI task.

-   **Speech Recognition (Voice-to-Text)**:
    -   **Tool**: Use Android's built-in `SpeechRecognizer` class. It's free and handles the system UI for listening.
    -   **Permission**: Requires `<uses-permission android:name="android.permission.RECORD_AUDIO" />`.

-   **Command Parsing (Intent Recognition)**: This is the core AI task.
    -   **Goal**: Replicate the `command-parser` flow.
    -   **Tool**: **TensorFlow Lite**. You need to create a text classification model that takes the string from the speech recognizer and outputs the "intent" and "entities".
    -   **Training Data**: You would create a dataset based on your prompt examples:
        -   `"Open Messages"` -> `{"intent": "launch_app", "entity": "Messages"}`
        -   `"Turn on dark mode"` -> `{"intent": "toggle_setting", "entity": "dark_mode"}`
    -   **Model**: Train a simple text classification model (e.g., using a MobileBERT architecture) in Python with TensorFlow/Keras. Then, convert the saved model to a `.tflite` file using the `TFLiteConverter`.
    -   **Inference**: Bundle the `.tflite` file in your app's `assets` folder and use the TensorFlow Lite Android Support Library to load the model and run inference on the user's command.

-   **App Categorization & Suggestions**:
    -   **Approach 1 (Simple)**: Instead of a full LLM, you can use a simpler approach. Map app package names to categories using public APIs or libraries (e.g., checking the Google Play category).
    -   **Approach 2 (ML)**: Train a classification model that takes app metadata (name, description from the Play Store) as input and outputs a category. This is more complex but mirrors the original AI feature more closely.

### 2.4. Architecture: Using ViewModels

Use the MVVM pattern to keep your code clean and testable.

-   **`HomeViewModel`**:
    -   Holds the state for the `HomeScreen` (e.g., list of apps, weather data).
    -   Uses Kotlin Coroutines to fetch the list of installed apps from the `PackageManager` on a background thread.
    -   Exposes this data to the UI using `StateFlow`.
-   **`VoiceAssistantViewModel`**:
    -   Manages the state of the speech recognition (e.g., `isListening`, `transcribedText`).
    -   Calls the `SpeechRecognizer`.
    -   When a command is received, it runs the on-device TensorFlow Lite model to get the intent.
    -   Communicates the resulting action back to the UI (e.g., via a `SharedFlow` of events) for the `Activity` or `HomeScreen` to handle.

This documentation provides a solid starting point for understanding the current web app and the path forward to a native Android implementation. Good luck!
