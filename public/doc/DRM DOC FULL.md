# DISASTER REPORT MAP (DRM)
**Comprehensive Strategic & Technical Documentation**

---

## 1. VISION & EXECUTIVE SUMMARY
Disaster Report Map (DRM) is an advanced, real-time crisis management and geospatial monitoring platform designed to crowdsource, track, and mitigate disaster incidents as they happen. At its core, DRM connects citizens on the ground with emergency administrators and first responders, significantly reducing communication friction during critical "golden hour" moments of a disaster. 

The original concept was developed as a hackathon minimum viable product (MVP), but this document outlines the architecture and strategy to scale DRM into a robust, enterprise-grade emergency response ecosystem.

---

## 2. CORE OBJECTIVES
* **Crowdsourced Intelligence:** Empower regular citizens to act as live sensors, dropping geographical pins and submitting multimedia reports of ongoing crises (e.g., floods, fires, structural collapses).
* **Real-time Situational Awareness:** Provide authorities with a live-updating heatmap and dashboard to track incident spread without refreshing.
* **Triage & Verification:** Establish a clear protocol for administrators to filter noise, verify authentic reports, and escalate critical emergencies.
* **Community Safety:** Keep the public informed in real-time about danger zones they should avoid through dynamic map layers (e.g., "Disaster Coverage Radars").

---

## 3. IDENTIFIED SYSTEM ROLES & PERMISSIONS

### 3.1 Unauthenticated User (Public Viewer)
* View the public-facing live map with generalized incident markers to see safe/unsafe zones.
* Cannot view exact PII (Personally Identifiable Information) or submit reports.

### 3.2 Citizen User (Authenticated)
* Register, login, and manage a user profile.
* Drop precise geo-location pins to report new incidents.
* Upload rich media attached to a report (photos, short videos, audio clips).
* Update the status of their own active reports (e.g., "Water receding").
* Add comments/updates to other citizens' reports nearby ("I can confirm this fire is spreading").
* Receive push notifications when an administrator verifies their report or updates their safe zone status.

### 3.3 System Administrator (Emergency Dispatcher / Moderator)
* Access a secure, high-density reporting dashboard.
* View all incidents globally, including reporter PII for follow-up.
* Filter data streams by severity, category, timestamp, and geospatial proximity.
* Update incident lifecycles (`pending` → `active` → `resolved`).
* Perform verification protocols (`unverified` → `community_confirmed` → `admin_confirmed`).
* Broadcast emergency alerts to all active users within a specific map polygon/radius.

---

## 4. INCIDENT LIFECYCLE & WORKFLOW

### Phase 1: Submission
A citizen experiences an emergency. They open the DRM Web App. Using the HTML5 Geolocation API, their exact coordinates are locked. They select a category (e.g., *Medical Emergency*), attach a photo, and hit submit. 

### Phase 2: Pending State
The report hits the MongoDB database. A WebSocket event is instantly emitted to the Admin Dashboard. The pin appears yellow (`pending`) on the map. Administrators see the incoming data stream.

### Phase 3: Active State & Verification
An Admin reviews the photo and the location. They change the status to `active` and verification to `admin_confirmed`. The pin turns Red on the global map. A "Radar Coverage Zone" is programmatically generated around the pin to warn others of the disaster radius. 

### Phase 4: Resolution
Once emergency services clear the area, the Admin updates the status to `resolved`. The pin turns Green or is archived off the active map entirely.

---

## 5. PROPOSED FEATURE ROADMAP (SCALING THE MVP)

### 5.1 Real-Time Media & Streaming
* **Live Video Feeds:** Allow users to stream short 10-second clips of the disaster directly to the dashboard rather than just static images.
* **Automated Audio Transcription:** Use AI to transcribe panic audio reports into readable text for dispatchers.

### 5.2 AI & Automation Layers
* **Automated Duplicate Detection:** If 50 people report a fire in the same 500-meter radius, the system should automatically cluster them into a single "Major Incident" to avoid overwhelming the dispatcher dashboard.
* **Spam & Fake Report Filtering:** Machine learning algorithms to flag suspicious reports (e.g., a user reporting a massive flood but their uploaded photo metadata shows it was taken 4 years ago).

### 5.3 Advanced Geospatial Mapping
* **Routing & Evacuation Paths:** Overlay safe routing algorithms. If a road is blocked by an incident pin, the map should dynamically draw evacuation routes around the danger radii.
* **Integration with Weather APIs:** Layer live weather data (wind direction, precipitation) onto the map so admins can predict which way a fire or flood will spread.
* **Offline Mode (Crucial for Disasters):** Implement Service Workers/PWA capabilities so if cellular networks go down during a hurricane, the app allows users to queue a report offline, which auto-syncs the second their phone catches a signal.

### 5.4 Community & Gamification
* **Reputation System:** Users who consistently submit verifiable, accurate emergency data gain "Trusted Reporter" badges, meaning their future reports bypass manual admin queues and go live instantly.

---

## 6. TECHNOLOGY STACK ARCHITECTURE

### 6.1 Frontend (Client Layer)
* **Framework:** Next.js (React) for SSR and SEO-optimized public pages, with dynamic client-side rendering for the complex map views.
* **Styling:** Tailwind CSS combined with Framer Motion for premium, fluid UI micro-animations during stressful reporting scenarios.
* **Mapping Engine:** Leaflet dynamically imported, utilizing CartoDB or Mapbox tiles to visually separate data layers cleanly.

### 6.2 Backend (API & Logic Layer)
* **API:** Next.js App Router API Routes to handle RESTful submissions securely.
* **Real-time Engine:** Socket.io or Pusher to maintain persistent zero-latency connections between the server and the admin dashboards.

### 6.3 Database & Storage Layer
* **Primary Database:** MongoDB (NoSQL) to handle flexible schema structures and massive spikes in chaotic, unstructured data during a localized catastrophe.
* **Geospatial Queries:** Utilizing MongoDB's native `$geoWithin` and `$near` algorithms to query incidents based on map bounds extremely fast.
* **Blob Storage:** AWS S3 or Cloudinary to host compressed image/video evidence attached to reports.

---

## 7. DATABASE SCHEMA SPECIFICATIONS (EXPANDED)

### 7.1 **Users Collection**
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (Indexed, Unique),
  passwordHash: String,
  profileImageUrl: String,
  role: Enum ["user", "admin", "superadmin"],
  reputationScore: Number (Default: 0),
  lastKnownLocation: { type: "Point", coordinates: [lng, lat] },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 7.2 **Incidents Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: Enum ["fire", "flood", "accident", "medical", "infrastructure_failure", "other"],
  severity: Enum ["low", "moderate", "critical"], 
  location: { 
      type: "Point", 
      coordinates: [lng, lat] // Required for GeoJSON indexing
  },
  impactRadiusMeters: Number (Default based on category),
  status: Enum ["pending", "active", "resolved", "false_alarm"],
  verificationStatus: Enum ["unverified", "community_confirmed", "admin_confirmed"],
  mediaUrls: [String], // Array of S3 image/video links
  reportedBy: ObjectId (Ref: "Users"),
  upvotes: Number, // Community verification count
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 8. SECURITY & COMPLIANCE
* **Rate Limiting:** IP-based rate limiting to prevent DDoS attacks from flooding the map with fake coordinates.
* **Data Privacy:** PII of the reporter must be stripped from the public map API endpoints. Only the incident's coordinates and description are broadcasted publicly. 
* **Authentication:** JWT (JSON Web Tokens) with short expiries, managed securely in httpOnly cookies.

---

*End of Document. Maintained by the DRM Engineering Team.*
