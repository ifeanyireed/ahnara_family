# Ahnara Family Portal & Mobile App 👨‍👩‍👧‍👦

Welcome to the **Ahnara Family** repository. This directory contains the consumer-facing client applications of the **Ahnara Med Suite**, which organizes health tracking and care continuum across all family members from conception to elder years. 

Instead of multiple fragmented applications, Ahnara Family bundles several consumer capabilities into a single download. Users are presented with personalized home screens tailored specifically to their role and current life stage.

---

## 📱 Supported Products & Bundled Capabilities

The applications in this repository bundle the following services:

*   **🤰 AHNARA Mama**: Pregnancy and maternal health platform. Features 40-week gestation tracking, danger-sign triage, birth planning, medication adherence, and a persistent emergency SOS button.
*   **👶 AHNARA Kids**: Developmental and growth tracking. Reimagines vaccination cards and pediatric records as portable, living records.
*   **👵 AHNARA Seniors (Elder-UI)**: Independent living companion for older adults. Includes daily wellbeing check-ins, medication compliance logs, memory games, AI companionship, and a custom **Scam Shield** for fraud protection.
*   **🌸 AHNARA Lady & Girlie**: Adolescent and non-pregnancy feminine health tracking focused on cycles, hormonal wellness, and educational guidance.
*   **💬 AHNARA Circle**: Private, clinically moderated community circles for trimester peers, parenting support, and caregiver discussions.
*   **🎓 AHNARA Academy**: Access to family-focused health, nutrition, and care courses.
*   **🎛️ Family Dashboard**: Unified multi-generational tracking and coordination screen that consolidates care logs, metrics, and alerts for the entire household.
*   **🩺 Consult (Patient Side)**: Queue-free patient telemedicine portal offering secure voice, video, and chat consultations with clinical specialists, plus digital prescription history.
*   **🛡️ Scam Shield (Seniors)**: NLP-powered security module that intercepts high-risk financial fraud, phishing texts, and unverified calls, routing critical alerts to the caregiver network.

---

## 📂 Repository Structure

This repository is split into two primary client platforms:

```
ahnara_family/
├── mobile-app/      # Cross-platform Flutter client application
└── web-app/         # Next.js web application (responsive desktop/tablet views)
```

### 1. Web Application (`/web-app`)
A Next.js (App Router) project built with React, TypeScript, and Tailwind CSS.
*   **Core Pages**:
    *   `/(family)/dashboard`: Overview of family health metrics, notifications, and alerts.
    *   `/(family)/anc`: Antenatal care logs, schedules, and trimesters timelines.
    *   `/(family)/birth-plan`: Personalized delivery preparation checklist.
    *   `/(family)/meds`: Shared family medication compliance and reminders.
    *   `/(family)/midwife`: Direct booking and messaging with assigned midwives.
    *   `/kids`: Pediatric profiles, growth curves, and vaccine history.
    *   `/(family)/academy`: Consumer-facing education portal.

### 2. Mobile Application (`/mobile-app`)
A Flutter mobile application targeting Android and iOS, built with Dart.
*   **Core Pages**:
    *   `lib/main.dart`: Contains the main mobile app routing, role-based views (Mama, Kids, Seniors, Circle), and notifications engine.

---

## 🚀 Getting Started

### Setting up the Web App
1.  Navigate to the web-app directory:
    ```bash
    cd web-app
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Launch the Next.js local development server:
    ```bash
    npm run dev
    ```
4.  Access the web app at [http://localhost:3000](http://localhost:3000).

### Setting up the Mobile App
1.  Navigate to the mobile-app directory:
    ```bash
    cd mobile-app
    ```
2.  Ensure you have the Flutter SDK installed on your machine.
3.  Fetch the Dart dependencies:
    ```bash
    flutter pub get
    ```
4.  Run the application on an emulator or connected device:
    ```bash
    flutter run
    ```

---

## 🔒 Subscription Management
All subscription limits (e.g. tracking limitations, multi-child premium profiles, and Seniors Complete+ access) are centrally managed via `SubscriptionHelper.ts` on the infrastructure layer. The client applications utilize `SubscriptionService` to dynamically adapt the user interface and features according to current active tier settings.
