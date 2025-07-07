# JSF Inventory Management System

A comprehensive inventory and HR management system for Jeevan Stambh Foundation (JSF), built with Next.js, TypeScript, TailwindCSS, and Firebase.

## Features

-   🔐 **Authentication & Authorization**: Firebase Auth with role-based access control
-   📦 **Inventory Management**: Track items, quantities, expiry dates, and locations
-   👥 **Staff Management**: Manage staff members, roles, and schedules
-   📊 **Real-time Updates**: Live data synchronization with Firebase Firestore
-   📱 **PWA Support**: Progressive Web App with offline capabilities
-   🌐 **Multilingual**: English and Hindi language support
-   📈 **Reports & Analytics**: Generate reports and export data
-   🔔 **Alerts & Notifications**: Low stock and expiry alerts
-   📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

-   **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
-   **Backend**: Firebase (Firestore, Auth, Storage)
-   **State Management**: React Context API
-   **HTTP Client**: Axios
-   **Internationalization**: react-i18next
-   **PWA**: Service Workers, Manifest
-   **UI Components**: Custom components with TailwindCSS

## Prerequisites

-   Node.js 18+
-   npm or yarn
-   Firebase project

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd jsf-inventory-management
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up Firebase**

    ### Create Firebase Project

    1. Go to [Firebase Console](https://console.firebase.google.com/)
    2. Create a new project or select an existing one
    3. Enable Authentication (Email/Password)
    4. Create a Firestore database
    5. Set up Storage (optional)

    ### Get Firebase Configuration

    1. Go to Project Settings > General
    2. Scroll down to "Your apps" section
    3. Click the web app icon (</>) to add a web app
    4. Register your app and copy the configuration

    ### Environment Variables

    Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
    NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
    ```

4. **Run the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase Setup Instructions

### 1. Authentication Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Create a test user or enable user registration

### 2. Firestore Database Setup

1. Go to Firestore Database in Firebase Console
2. Create database in production mode
3. Set up security rules for your collections:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Users can read/write their own data
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }

        // Inventory items - authenticated users can read, admins can write
        match /inventory/{itemId} {
          allow read: if request.auth != null;
          allow write: if request.auth != null &&
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'coordinator'];
        }

        // Staff members - authenticated users can read, admins can write
        match /staff/{memberId} {
          allow read: if request.auth != null;
          allow write: if request.auth != null &&
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'coordinator'];
        }
      }
    }
    ```

### 3. Storage Setup (Optional)

1. Go to Storage in Firebase Console
2. Create a storage bucket
3. Set up security rules for file uploads

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── inventory/         # Inventory pages
│   ├── staff/            # Staff pages
│   └── login/            # Authentication pages
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/              # UI components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── globals.css           # Global styles
```

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run type-check` - Run TypeScript type checking

## Features in Detail

### Authentication

-   Email/password authentication
-   Role-based access control (admin, coordinator, volunteer)
-   Protected routes
-   User session management

### Inventory Management

-   Add, edit, delete inventory items
-   Track quantities, costs, and expiry dates
-   Categorize items (medicine, equipment, supplies)
-   Set minimum stock levels
-   Search and filter functionality
-   Export to CSV

### Staff Management

-   Manage staff members and their roles
-   Track specialties and schedules
-   Monitor patients served
-   Active/inactive status tracking

### Real-time Features

-   Live data updates across all clients
-   Offline support with service workers
-   Background sync for data updates
-   Push notifications for alerts

### PWA Features

-   Installable web app
-   Offline functionality
-   Background sync
-   Push notifications
-   App-like experience

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

-   **Netlify**: Similar to Vercel setup
-   **Firebase Hosting**: Use `npm run build` and deploy to Firebase Hosting
-   **Docker**: Create Dockerfile for containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

-   Create an issue in the repository
-   Contact the development team
-   Check the documentation

## Changelog

### v1.0.0

-   Initial release
-   Basic inventory and staff management
-   Authentication system
-   PWA support
-   Multilingual support
