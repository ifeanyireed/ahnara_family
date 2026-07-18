# Ahnara Care Ecosystem: Family Dashboard & Circle Workspace Plan

This document outlines the product strategy, target audience, interface designs, and mobile implementation architectures for both the **Family Dashboard** and the **Circle Workspace** modules within the Ahnara care application.

---

## 1. Product Strategy & Philosophy

### 1.1 The Family Dashboard: "Passive Confidence, Not Active Anxiety"
Caregiving for independent elders or tracking developmental milestones for toddlers often floods family members with noisy alerts, causing friction and stress. 

Ahnara’s design philosophy shifts care monitoring to a model of **passive confidence**:
*   **Deviation-Only Alerting**: Raw wellness data remains nested. The user is only actively prompted with alert cards when a metric departs from the baseline (e.g., missed check-ins, medication non-compliance, or a flagged phone scam).
*   **Glanceable Statusing**: The dashboard prioritizes color-coded rings and visual grids over long tables, enabling busy adult children or partners to check in within three seconds.

### 1.2 The Ahnara Circle: Clinical-Grade Milestones Support
Standard parent feeds and health forums are vulnerable to unverified medical claims and user isolation. Ahnara Circle addresses this by:
*   **Life-Stage Sandboxing**: Restricting user groups to verified stages (e.g., trimester-based pregnancy support, age-banded parenting, elder caregiver support, and adolescent puberty groups).
*   **Clinician-in-the-Loop**: Pinned expert profiles, audio Q&As, and gold shield badges ensure that clinically validated advice remains at the top of every feed.
*   **Secure Escalation**: A triage router (Clinician Ask Gateway) that bridges public peer discussions to private telemedicine consults.

---

## 2. User Matrix: Who Sees What?

The sharing model utilizes granular permission toggles configured by the care recipient to guarantee privacy boundaries:

| User Role | Family Dashboard View | Circle Workspace Access |
| :--- | :--- | :--- |
| **Mamas (Maternal)** | Progress logs, ultrasound photos, shared midwife/obstetrician appointments. | Trimester-themed support boards, pregnancy workouts, and clinical Q&A. |
| **Parents (Kids)** | Pediatric growth charts, immunization schedules, developmental milestones. | Age-banded parenting groups (newborns, toddlers), feeding advice. |
| **Seniors (Elders)** | Active status, daily check-ins check-off, geofence safety. | Elder activity forums, memory support games, carer shift logs. |
| **Lady Care (Women's)** | Cycle tracking charts, fertility windows, menopausal symptom maps. | Reproductive wellness, gynecological discussions. |
| **Girlie (Adolescents)** | Sync check for safety codes, parent-consented supply requests. | Sandboxed adolescent milestoning boards, locked journal entries. |

---

## 3. UI/UX Interface Modules (Mobile App Implementation)

We have implemented these modules as interactive screens accessible from the Profile Drawer inside the Flutter mobile application (`lib/main.dart`):

### 3.1 Family Dashboard Screen (`FamilyDashboardPage`)
1.  **Wellbeing Status Ring**: An interactive circular ring color-coded dynamically (Green = Safe, Amber = Pending Check-in, Red = SOS Triggered) showing current status details.
2.  **AI Scam Shield Banner**: A critical-level warning card displaying flagged phishing text messages received by the elder, with buttons to *"Dismiss & Block"* or instantly *"Call Recipient"*.
3.  **Medication Compliance Heatmap**: A compact **7x4 grid** representing the 7 days of the week and 4 daily intervals (Morning, Afternoon, Evening, Night). Checks indicate completed intakes; gray boxes denote pending/missed doses.
4.  **Wearable Telemetry Card**: Double-column widget showing real-time heart rate (BPM) and step counts synced from Apple Watch / Fitbit.
5.  **Caregiver GPS logs**: Displays checked-in home nurse shift records and visit notes.

### 3.2 Circle Feed Screen (`AhnaraCircleFeedPage`)
1.  **Verified Group Finder Tabs**: Horizontal scrolling category pill selectors representing Maternal, Newborn, Geriatric, Lady, and Adolescent categories.
2.  **Expert Q&A Card**: Daily highlighted question card displaying credentials of the answering doctor and an audio player widget to play recorded voice responses.
3.  **Peer Matcher Card (CI-03)**: Matchmaker wizard allowing users to configure shared challenge filters (e.g. twin pregnancy, dementia care) and connect securely via a private chat gate.
4.  **Community RSVP Calendar**: RSVP tracking and event detail cards for local seminars.
5.  **Family Circle Sharing Link (CI-07)**: Permission switch panel allowing the user to choose precisely what progress reports are shared, with an invite link generator.
6.  **Direct Clinician Ask Button**: Custom gateway that escalates public questions directly to a private telemedicine consult.
7.  **Community Safety Panel**: An admin-toggled moderation view showing AI flagged incidents, strike trackers, and comments approval systems.

---

## 4. Mobile Code Integration Detail

### 4.1 Navigation Entry Points
Outlined buttons are integrated within the Profile Drawer (`_showProfileBottomSheet`) in `lib/main.dart`:
```dart
// Launcher row in the Bottom Sheet
Row(
  children: [
    Expanded(
      child: OutlinedButton.icon(
        onPressed: () { ... Navigator.push(context, MaterialPageRoute(builder: (context) => FamilyDashboardPage(...))); },
        icon: Icon(TablerIcons.layout_dashboard),
        label: Text('Family Hub'),
      ),
    ),
    SizedBox(width: 10),
    Expanded(
      child: OutlinedButton.icon(
        onPressed: () { ... Navigator.push(context, MaterialPageRoute(builder: (context) => AhnaraCircleFeedPage(...))); },
        icon: Icon(TablerIcons.users),
        label: Text('Circle Feed'),
      ),
    ),
  ],
)
```

### 4.2 Dynamic Color Integration
Themes automatically match the current active workspace profile color by querying:
```dart
Color _getThemeColor() {
  switch (_activeCategoryIndex) {
    case 0: return const Color(0xFF8BB436); // Mama (Green)
    case 1: return const Color(0xFF0089C1); // Kids (Cyan)
    case 2: return const Color(0xFF6366F1); // Seniors (Indigo)
    case 3: return const Color(0xFFE11D48); // Lady (Rose)
    case 4: return const Color(0xFFE572A1); // Girlie (Orchid)
    default: return const Color(0xFF001C28);
  }
}
```
[text](../../../var/folders/tf/hjrm8by51jl9q7c4xbmbmjdr0000gn/T/com.apple.useractivityd/shared-pasteboard/items/8B77E679-ADC6-4DE6-BA40-77ADE371BF6B/527101f289a383ed7cf0c3b9bed5bad26a80bfab.rtfd)