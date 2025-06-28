# Hidden Spaces - Frontend

A React frontend for the Hidden Spaces community platform.

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your Flask API URL
   \`\`\`

3. **Start development:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

## 🔌 Backend Integration

This frontend expects a Flask API running on `http://localhost:5000` with these endpoints:

- `POST /api/auth/login`
- `POST /api/auth/register` 
- `GET /api/spaces/categories`
- `GET /api/spaces`
- `GET /api/spaces/{id}`
- `POST /api/spaces`
- `PUT /api/spaces/{id}`
- `DELETE /api/spaces/{id}`

## 📁 Project Structure

- `src/pages/` - All application pages
- `src/components/ui/` - Reusable UI components
- `src/lib/api.ts` - API integration functions
- `vite.config.ts` - Proxy configuration for development

## 🌐 Deployment

This is a static React app that can be deployed to:
- Vercel
- Netlify  
- AWS S3
- Any static hosting service

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
