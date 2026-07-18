# Integration Plan: Circle Workspace & Family Dashboard

This integration document outlines the design architecture, database schema additions, and step-by-step implementation roadmap for incorporating **AHNARA Circle** and the **Family Dashboard** into the `ahnara_family` codebase.

---

## 1. Core Architectural Goals
*   **Role-Based Dynamic Templating**: Automatically adapt UI styling, colors, category listings, and permission boundaries based on the user's active workspace index (`0` through `4`).
*   **Passive Confidence UI**: Design the family monitoring dashboard to prioritize quick-scan indicators (heatmaps, color status) over dense logs.
*   **Clinical Moderation**: Implement automated natural language processing flags and verified clinician badges on community feeds to prevent unverified medical advice.

---

## 2. Platform Adaptation Matrix

The platform dynamically adjusts styling and UI metadata based on the active role context:

| Portal Index | Workspace Name | Primary Circle Target | Pinned Specialist Badge | Accent Color (Hex) |
| :--- | :--- | :--- | :--- | :--- |
| **0** | Maternal Care (Mama) | Trimester milestones, prenatal nutrition, birth plans. | Midwife / Obstetrician | `#8BB436` (Lime) |
| **1** | Pediatric Care (Kids) | Age-banded parenting (infant, toddler), vaccines. | Pediatrician | `#0089C1` (Cyan) |
| **2** | Geriatric Care (Seniors) | Elder assistance, dementia care, caregiver support. | Gerontologist / Care Manager | `#6366F1` (Indigo) |
| **3** | Lady Care (Lady) | Reproductive wellness, menstrual cycle, menopause. | Gynecologist | `#E11D48` (Rose) |
| **4** | Adolescent Care (Girlie) | Puberty, body confidence, school hygiene. | Teen Counselor / Clinician | `#E572A1` (Orchid Pink) |

---

## 3. Database Schema Extensions (Shared Microservices)

To support Circle link permissions and direct peer matches, we extend the central storage tables with the following relational models:

```sql
-- Family Circles Relationships
CREATE TABLE family_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_user_id UUID NOT NULL,
    linked_user_id UUID NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- 'spouse', 'child', 'parent', 'caregiver'
    permission_mask INT NOT NULL DEFAULT 0,  -- Bitmask (1=vitals, 2=meds, 4=GPS, 8=consults)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_family_link UNIQUE (host_user_id, linked_user_id)
);

-- Peer matching sessions (CI.3)
CREATE TABLE peer_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_one_id UUID NOT NULL,
    user_two_id UUID NOT NULL,
    match_category VARCHAR(100) NOT NULL, -- e.g., 'twin-pregnancy', 'dementia-home-care'
    match_score INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Next.js Web App Integration (`web-app`)

### 4.1 UI Layout & Navigation
*   **Routing Shell**: Expose global paths `/circle` and `/dashboard/family` protected by the custom `RoleGuard` component.
*   **Active Context Hook**: Use a React hook `useWorkspace()` to inject active styles and token configurations dynamically.

### 4.2 On-Screen Modules

```mermaid
graph TD
    A[Ahnara Global Layout] --> B[/circle Route]
    A --> C[/dashboard/family Route]
    B --> B1[Active Workspace Feed Filter]
    B --> B2[Clinical NLP Moderator]
    B --> B3[Direct Clinician Ask Portal]
    C --> C1[Wellbeing Ring Indicator]
    C --> C2[Medication Heatmap Grid]
    C --> C3[Wearable Telemetry Charts]
```

*   **Clinical NLP Moderator (CI.2, CI.5)**: Implemented in Next.js API routes using natural language classification to flag posts containing unverified medical advice with warning banners.
*   **Family Dashboard (Seniors Sync)**: Builds dynamic Line Charts mapping blood pressure and heart rate wearable summaries, with a Grid component rendering medication checklists.

---

## 5. Flutter Mobile App Integration (`mobile-app`)

### 5.1 Dynamic View Shell
Extend the active bottom navigation bar inside `main.dart` to support the Circle tab:

```dart
_buildNavItem(5, TablerIcons.users, 'Circle')
```

### 5.2 Dynamic Workspace Renderers

#### A. Family Dashboard Content (`_buildFamilyHubContent()`)
```dart
Widget _buildFamilyHubContent() {
  final accent = _getWorkspaceColor();
  return ListView(
    children: [
      // Wellbeing status color header
      _buildWellbeingRing(status: "green", accentColor: accent),
      
      // Medication weekly compliance heatmap
      _buildMedsComplianceHeatmap(),
      
      // Device summaries (Steps, BP)
      _buildTelemetryCard(),
    ],
  );
}
```

#### B. Life-Stage Feed (`_buildCircleFeedContent()`)
*   Provides category search indexes matching the user's active life stage (e.g. Trimester 1 lists in Mama; acne, screen time guidelines in Girlie).
*   Integrates inline Gold Shield expert badges next to verified clinicians.
*   Houses the **Peer Matching Wizard** card deck allowing users to tap and establish anonymous chat gates with peers.

---

## 6. Implementation Checklist & Phase Roadmap

- [ ] **Phase 1: DB & API Setup** (Create PostgreSQL migration scripts and mock API controllers for peer matches, family relationships, and NLP filters).
- [ ] **Phase 2: Next.js Layout Layouts** (Update `AhnaraNav.tsx` and implement layout frameworks for `/circle` and `/dashboard/family`).
- [ ] **Phase 3: Next.js NLP Dialogue Filter** (Incorporate semantic keyword scanners inside web-app feeds).
- [ ] **Phase 4: Flutter Bottom Tabs Expansion** (Add navigation items and map route indices in the state transitions inside `main.dart`).
- [ ] **Phase 5: Flutter Widget Integrations** (Port the medication compliance heatmap, peer matching cards, and custom family circle permissions dials into `main.dart`).
