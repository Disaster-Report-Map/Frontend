
1

Automatic Zoom
Disaster Report Map (DRM) Hackathon Technical Documentation
DISASTER REPORT MAP (DRM)
Hackathon Technical Documentation – Version 1.0
1. PRODUCT OVERVIEW
Disaster Report Map (DRM) is a real-time web application that enables citizens to report disas-
ter incidents using geolocation and allows administrators to monitor, verify, and update these
incidents through a centralized dashboard.
The platform provides a live interactive map interface for incident reporting and visualization.
It improves situational awareness and reduces communication delays between citizens and au-
thorities. This version is developed as a hackathon MVP.
Technology Stack
- Frontend: Next.js
- Backend: Next.js API routes or Node server with WebSocket support
- Database: MongoDB
- Real-Time Communication: WebSockets
- Maps: Google Maps API or Mapbox
2. SYSTEM ROLES
2.1 Citizen User
A registered user who can report and view disaster incidents. Permissions:
• Register and login
• View interactive disaster map
• Report a new incident
• View incident details
• View own reports
• Update status of own report
• Edit profile information
2.2 Administrator
An authorized official with moderation capabilities. Permissions:
• View all incidents
Page 1 of 4
Disaster Report Map (DRM) Hackathon Technical Documentation
• Filter incidents by category, status, and date
• Update incident status
• Mark incidents as verified
• View reporter details
3. HIGH LEVEL SYSTEM ARCHITECTURE
- Frontend Layer: Next.js application with protected routes for authenticated users and
administrators.
- Backend Layer: API endpoints built using Next.js API routes or Node server.
- Database Layer: MongoDB for storing users and incident data.
- Real-Time Layer: WebSocket connection for broadcasting new incidents, status updates,
and live synchronization.
Architecture Flow: 1. User submits report via frontend. → 2. Backend validates and stores
report in MongoDB. → 3. Backend emits WebSocket event. → 4. All connected clients receive
real-time update. → 5. Map updates instantly.
4. DATABASE SCHEMA DESIGN
4.1 User Collection
{
_id,
fullName,
email,
passwordHash,
profileImageUrl,
role: "user" | "admin",
createdAt,
updatedAt
}
4.2 Incident Collection
{
_id,
title,
description,
category: "fire" | "flood" | "accident" | "medical" | "other",
location: { latitude, longitude },
status: "pending" | "active" | "resolved",
verificationStatus: "unverified" | "community_confirmed" | "admin_confirmed",
reportedBy: userId,
Page 2 of 4
