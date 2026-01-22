FitAlly Admin Console

FitAlly Admin Console is a Vue 3 + Vuetify based web application used to manage all dynamic content for the FitAlly Fitness Platform.

This admin panel allows authorized users to manage:

Workouts

Exercises

Media (Images & YouTube Videos)

Programs (30/60/90 day plans)

CMS Content (Homepage, banners, pages, promotions)

Everything is dynamic and powered by the FitAlly Spring Boot backend.

🚀 Features
Content Management

Create & manage workouts

Add exercises under workouts

Upload images (Cloudinary)

Add YouTube video links

Build structured fitness programs

Manage CMS content (Home, About, etc.)

Modern UI

Responsive layout (mobile + desktop)

Sidebar navigation

Dashboard overview

Vuetify Material Design

Backend Integration

Connects to FitAlly Spring Boot APIs

Uses Axios for API calls

Ready for JWT authentication

🛠 Tech Stack

Vue 3

Vuetify 3

Vite

Axios

Pinia

Vue Router

📦 Project Setup
1. Prerequisites

Make sure you have:

node -v
npm -v

2. Install Dependencies
   npm install

3. Run the App
   npm run dev


Open in browser:

http://localhost:5173

🌐 Backend Connection

The admin console connects to the FitAlly backend API:

http://localhost:8080/api


Make sure your backend is running before using the admin panel.

📁 Project Structure
src/
api/          # Axios API clients
views/        # Pages (Dashboard, Workouts, Programs, CMS)
components/   # Reusable UI components
layouts/      # Admin layout with sidebar
router/       # Vue Router setup
stores/       # Pinia state management

🔐 Authentication (Planned)

Currently, authentication is disabled for development.

Planned features:

JWT login

Role-based access

Secure admin routes

🖼 Media Rules
Media Type	Method
Images	Uploaded to Cloudinary
Videos	YouTube URLs only
Audio	URL-based (future)

This ensures fast performance and avoids heavy uploads.

🧠 Design Philosophy

No hardcoded content

Fully admin-driven UI

Reusable workouts & exercises

Scalable structure

Production-ready mindset

🛣 Roadmap

Enable JWT authentication

User management UI

Analytics dashboard

Activity logs

CI/CD deployment

Mobile-first UX improvements

👨‍💻 Author

FitAlly Team
Built to support a scalable fitness & wellness platform.

⭐ Final Note

This admin console is designed to manage everything dynamically for the FitAlly platform.

No content is hardcoded.
Everything is controlled from this panel.