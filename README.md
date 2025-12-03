# Disaster Response Map - Frontend

A real-time disaster reporting and mapping application built with React, TypeScript, and modern web technologies. Users can report disasters (floods, fires, accidents, building collapses) and view all reports on an interactive map with live updates.

## 🚀 Features

- **Interactive Map**: Full-screen map with disaster markers using React Leaflet
- **Real-time Updates**: Live polling every 10 seconds for new reports
- **Disaster Reporting**: Easy-to-use form with geolocation and image upload
- **Proximity Alerts**: Automatic alerts for disasters within 5km of user location
- **Live Feed**: Sidebar with recent reports and filtering options
- **AI Summary**: Generated summary of disaster activity in the last 24 hours
- **Responsive Design**: Works on desktop and mobile devices
- **Mock Data Mode**: Demo-ready with realistic sample data

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Leaflet** for interactive maps
- **TanStack Query** for server state management
- **Axios** for HTTP requests
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
src/
├── api/                 # API layer and mock data
│   ├── client.ts       # Axios configuration
│   ├── mockData.ts     # Sample disaster reports
│   └── reports.ts      # API functions
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components (Button, Modal, Alert)
│   ├── layout/        # Layout components (Navbar, LiveFeed, AlertBanner)
│   ├── map/           # Map-related components
│   └── forms/         # Form components
├── features/          # Page-level features
│   └── map/           # Main map page
├── hooks/             # Custom React hooks
│   ├── api/           # API-related hooks
│   ├── geolocation/   # Geolocation hooks
│   └── utils/         # Utility hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── config/            # Configuration files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd global-hackathon-v1/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=https://disaster-report-map.onrender.com/api

# Development Configuration
VITE_USE_MOCK_DATA=false

# Production Configuration (for deployment)
# VITE_API_BASE_URL=https://your-backend-api.com/api
# VITE_USE_MOCK_DATA=false
```

### Mock Data Mode

The application runs in mock data mode by default, which means:
- No backend required for demo
- Realistic sample disaster reports
- Simulated API delays and responses
- All features work out of the box

To switch to real API mode, set `VITE_USE_MOCK_DATA=false` and provide a valid `VITE_API_BASE_URL`.

## 🎯 Usage

### Reporting a Disaster

1. Click the **"+"** button in the bottom-right corner
2. Select disaster type (Flood, Fire, Accident, Building Collapse)
3. Provide a description
4. Use current location or click on the map to select location
5. Optionally upload a photo
6. Submit the report

### Viewing Reports

- **Map View**: All reports appear as markers on the map
- **Live Feed**: Recent reports in the sidebar with filtering options
- **Proximity Alerts**: Automatic alerts for nearby disasters
- **AI Summary**: Overview of disaster activity in the top-left

### Map Interaction

- **Zoom**: Mouse wheel or zoom controls
- **Pan**: Click and drag
- **Markers**: Click to view report details
- **Location**: Click anywhere to report a disaster at that location

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   In Vercel dashboard, add:
   - `VITE_API_BASE_URL`: Your backend API URL
   - `VITE_USE_MOCK_DATA`: `false` (for production)

### Netlify

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository

3. **Set Environment Variables**
   In Netlify dashboard, add the same variables as above

### Other Platforms

The built files in the `dist` directory can be deployed to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Azure Static Web Apps

## 🧪 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

### Key Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling with IntelliSense

## 🔌 API Integration

### Backend Requirements

When connecting to a real backend, ensure it provides these endpoints:

```typescript
// GET /api/reports
// Returns: { reports: DisasterReport[], total: number }

// POST /api/reports
// Body: FormData with type, description, latitude, longitude, image (optional)
// Returns: { success: boolean, report?: DisasterReport, error?: string }

// GET /api/ai/summary
// Returns: AISummary object

// PATCH /api/reports/:id/status
// Body: { status: 'active' | 'resolved' | 'investigating' }
```

### Mock Data

The mock data includes:
- 8 sample disaster reports across Lagos, Nigeria
- Realistic timestamps and descriptions
- Various disaster types and statuses
- Sample images from Unsplash

## 🎨 Customization

### Styling

- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Components**: All components use Tailwind classes for easy customization
- **Icons**: Replace Lucide React icons with your preferred icon library

### Map Configuration

- **Default Location**: Change in `DisasterMap.tsx` (currently Lagos, Nigeria)
- **Tile Layer**: Modify the OpenStreetMap tile URL
- **Zoom Levels**: Adjust initial zoom and bounds

### Polling Intervals

- **Reports**: 10 seconds (configurable in `useReports.ts`)
- **AI Summary**: 5 minutes (configurable in `useAISummary.ts`)

## 🐛 Troubleshooting

### Common Issues

1. **Map not loading**
   - Check if Leaflet CSS is imported
   - Verify internet connection for tile loading

2. **Geolocation not working**
   - Ensure HTTPS in production
   - Check browser permissions

3. **API errors**
   - Verify `VITE_API_BASE_URL` is correct
   - Check CORS settings on backend

4. **Build errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is part of a hackathon submission. See the main repository for license information.

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the troubleshooting section
- Review the code comments
- Open an issue in the repository

---

**Built with ❤️ for disaster response and community safety**