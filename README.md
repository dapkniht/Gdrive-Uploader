# 📂 Gdrive-Uploader

A full-stack Node.js application for uploading files to Google Drive from URLs, featuring real-time progress tracking, job queue management, and a modern React frontend.

## ✨ Features

- **🔗 URL-based Upload**: Upload files directly to Google Drive using URLs
- **📊 Real-time Progress**: Live progress tracking with Server-Sent Events (SSE)
- **⚡ Queue Management**: Background job processing with BullMQ and Redis
- **🔐 Google OAuth**: Secure authentication with Google Drive API
- **💾 Storage Validation**: Automatic Google Drive quota checking before upload
- **📱 Modern UI**: Responsive React frontend with Tailwind CSS and shadcn/ui
- **🌙 Dark Mode**: Built-in dark/light theme support
- **📋 Job History**: Track all upload jobs with filtering capabilities

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
- **Express.js** - Web framework
- **BullMQ** - Job queue management
- **Redis** - Queue storage and caching
- **SQLite** - Job progress persistence
- **Google APIs** - Drive integration and OAuth
- **Passport.js** - Authentication middleware

### Frontend (React + TypeScript)
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **Axios** - HTTP client
- **Server-Sent Events** - Real-time updates

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Redis server
- Google Cloud Console project with Drive API enabled

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gdrive-uploader/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback
   GDRIVE_UPLOAD_FOLDER_NAME=Uploads
   JWT_SECRET=your_jwt_secret
   TOKEN_ENCRYPT_SECRET=your_encryption_secret
   FRONTEND=http://localhost:5173
   ```

4. **Start Redis server**
   ```bash
   redis-server
   ```

5. **Run the backend**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

### Google Cloud Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Drive API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/callback`

4. **Configure OAuth Consent Screen**
   - Add required scopes: `profile`, `https://www.googleapis.com/auth/drive`

## 📖 Usage

1. **Authentication**
   - Visit `http://localhost:5173`
   - Click "Sign in with Google"
   - Grant necessary permissions

2. **Upload Files**
   - Navigate to the "Uploader" page
   - Paste a file URL
   - Click "Upload" to start the process

3. **Monitor Progress**
   - Visit the "Jobs" page to see real-time upload progress
   - Filter jobs by status (running, pending, success, failed)

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/login` - Initiate Google OAuth
- `GET /api/auth/callback` - OAuth callback
- `POST /api/auth/save-token` - Save encrypted token
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Upload
- `POST /api/upload` - Start file upload
- `GET /api/upload/progress` - SSE endpoint for progress updates

## 🛠️ Development

### Project Structure

```
gdrive-uploader/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Google config
│   │   ├── controllers/     # Route handlers
│   │   ├── jobs/           # Queue and worker definitions
│   │   ├── middlewares/    # Authentication middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Route components
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities and configurations
│   └── package.json
└── README.md
```

### Key Technologies

- **Queue Processing**: BullMQ with Redis for reliable background job processing
- **Real-time Updates**: Server-Sent Events for live progress tracking
- **Authentication**: JWT tokens with encryption for secure session management
- **File Handling**: Streaming uploads to Google Drive with progress callbacks
- **UI Components**: shadcn/ui for consistent, accessible design system

## 🔒 Security Features

- **Token Encryption**: JWT tokens are encrypted before client storage
- **CORS Protection**: Configured for specific frontend origin
- **Input Validation**: URL validation and file size checking
- **OAuth Scopes**: Minimal required permissions for Google Drive access

## 🚧 Current Status

⚠️ **This project is currently under active development and not yet production-ready.**

### Completed Features
- ✅ Google OAuth authentication
- ✅ File upload from URLs to Google Drive
- ✅ Real-time progress tracking
- ✅ Job queue management
- ✅ Modern React frontend
- ✅ Storage quota validation

### Planned Features
- 🔄 Batch upload support
- 🔄 Upload history with search
- 🔄 File type restrictions
- 🔄 Upload scheduling
- 🔄 Email notifications
- 🔄 Docker containerization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on the repository.