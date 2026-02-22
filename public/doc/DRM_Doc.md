# Disaster Report Map (DRM) - Developers Guide & Task Matrix
**Internal Engineering Documentation for the DRM Core Team**

Welcome to the technical blueprint for developing the DRM Hackathon MVP. This document is written specifically for the developers. It outlines exactly what features and logic need to be implemented on each specific page so the team can work in parallel without bottlenecks.

---

## 👥 Meet The Core Engineering Team
Connect, collaborate, and review PRs with your fellow engineers by visiting their GitHub profiles below:

* **[Samuel Ezekiel (@samkiell)](https://github.com/samkiell)** - Owner / Lead Developer
* **[Abraham Ayomiposi Oluwaniyi (@Abraham123-dev)](https://github.com/Abraham123-dev)** - Core Member
* **[Ayomide Philip (@Ayomide-Philip)](https://github.com/Ayomide-Philip)** - Core Member
* **[Danieee27 (@Danieee27)](https://github.com/Danieee27)** - Core Member
* **[ANYAOGU .C. ZABDIEL (@fwesh001)](https://github.com/fwesh001)** - Core Member
* **[Isidora Ose (@Isidora-Ose)](https://github.com/Isidora-Ose)** - Core Member
* **[Lupo Oluwatobi Daniel (@LupoNetn)](https://github.com/LupoNetn)** - Core Member

---

## 🏗️ SYSTEM ARCHITECTURE & STACK
Ensure your local environment matches these specs before spinning up the Next.js dev server:
* **Frontend:** Next.js (TypeScript, App Router) & TailwindCSS
* **Mapping Engine:** Leaflet dynamically loaded to avoid SSR crashes. (Avoid Mapbox strict licensing for the hackathon).
* **Backend Backend:** Node.js/Next.js API routes with WebSockets.
* **Database:** MongoDB
* **Real-time Sync:** Socket.io / Pusher implementation

---

## 🗺️ PAGE-BY-PAGE DEVELOPMENT MATRIX
*Here is the roadmap detailing precisely what needs to be built on each specific frontend route.*

### 1. `app/login/page.tsx` & `app/register/page.tsx` (Authentication Forms)
**Goal:** Clean, fast onboarding for Citizens and Admins to generate a secure session.
* **UI/UX:** Must fit seamlessly within the global `<Header>` and `<Footer>` layout. Keep it simple, centered floating cards.
* **Logic to implement:** 
  * Wire up inputs to React Hook Form and Zod for validation.
  * Connect to the `registerRequest` and `loginRequest` from the auth library.
  * Trigger `initSocket()` and `connectSocket()` immediately upon a successful login.
  * Store the JWT in HttpOnly cookies or secure context. State should hit the `useAuthStore` Zustand store.

### 2. `app/(dashboard)/dashboard/page.tsx` (The Live Radar Core)
**Goal:** The flagship real-time map taking up 100% of the screen.
* **UI/UX:** A full bleed `absolute inset-0` Leaflet container rendering standard OpenStreetMap tiles.
* **Logic to implement:**
  * Request `navigator.geolocation` so the map auto-centers around the user (for reporting proximity).
  * Subscribe to `/api/incidents` to fetch the global array of incidents on mount.
  * **Socket Connection:** Hook the component to the active Socket.io instance. When an `INCIDENT_NEW` or `INCIDENT_UPDATE` event fires, dynamically splice the React state so the map pin updates instantly without the browser refreshing.
  * Implement the Leaflet popup bindings to show Title, Category, and Status when a pin is clicked.

### 3. `app/report/new/page.tsx` (Incident Submission Portal)
**Goal:** The interface where a citizen on the ground alerts the system.
* **UI/UX:** A mobile-first, easy-to-click form (huge buttons, clear labels) specifically designed for people in high-stress situations.
* **Logic to implement:**
  * **Location Capture:** Must passively attempt to lock onto GPS coordinates or allow users to manually drag a pin if their GPS is failing.
  * **Fields Required:** Must hook to the Mongoose `Incident` schema (Title, Description, Category enum, Severity). 
  * **Media Upload:** Connect logic to append an image file via FormData to an S3/Cloudinary bucket layer before returning the URL to MongoDB.

### 4. `app/(dashboard)/my-reports/page.tsx` (Citizen Overview)
**Goal:** A centralized list of all reports owned by the logged-in user.
* **UI/UX:** Simple Tailwind list or table layout with clear status badges (Pending = Yellow, Active = Red, Resolved = Green).
* **Logic to implement:**
  * Query backend utilizing the specific user's token id `reportedBy: userId`.
  * **Status Toggles:** A select dropdown allowed *only* for citizens to change their *own* report statuses (e.g. updating a Flood from 'active' to 'resolved' when water recedes). The backend route MUST check if the `userId` matches the token before allowing this database alteration.

### 5. `app/(dashboard)/settings/page.tsx` (Profile Management & Danger Zone)
**Goal:** Account handling and security.
* **UI/UX:** Clean stacked forms with "Danger Zone" sections clearly marked in Red.
* **Logic to implement:**
  * Form 1: Update full name and profile image avatar.
  * Form 2: Change password requiring old password validation first.
  * Form 3: `Delete Account` - which should trigger a soft-delete or cascade across the database.

---

## 🗄️ MONGODB SCHEMAS (Reference)

**User Collection**
Requires: `fullName`, `email`, `passwordHash`, `role` ("user"|"admin"), `createdAt`.

**Incident Collection**
Requires: `title`, `description`, `category` ("fire"|"flood"|"accident"|"medical"|"other"), `status` ("pending"|"active"|"resolved"), `location` (GeoJSON coordinates struct), `verificationStatus` ("unverified"|"community_confirmed"|"admin_confirmed"), `reportedBy` (userId).

---
*Happy Coding! Let's build something that matters.*
