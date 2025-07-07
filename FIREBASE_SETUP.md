# Firebase Setup Guide

This guide will help you set up Firebase for the JSF Inventory Management System.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "jsf-inventory-management")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click **Save**

## Step 3: Create Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location for your database (choose the closest to your users)
5. Click **Done**

## Step 4: Set Up Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the default rules with the following:

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

3. Click **Publish**

## Step 5: Get Your Firebase Configuration

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Scroll down to the **Your apps** section
3. Click the web app icon (</>) to add a web app
4. Register your app with a nickname (e.g., "JSF Inventory Web App")
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
	apiKey: 'your-api-key-here',
	authDomain: 'your-project-id.firebaseapp.com',
	projectId: 'your-project-id',
	storageBucket: 'your-project-id.appspot.com',
	messagingSenderId: '123456789',
	appId: '1:123456789:web:abcdef123456',
};
```

## Step 6: Create Environment Variables

1. In your project root, create a file called `.env.local`
2. Add the following content, replacing the values with your actual Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 7: Optional - Set Up Storage

1. In your Firebase project, go to **Storage** in the left sidebar
2. Click **Get started**
3. Choose **Start in production mode**
4. Select a location for your storage bucket
5. Click **Done**

## Step 8: Test Your Setup

1. Restart your development server:

    ```bash
    npm run dev
    ```

2. Open your browser and go to `http://localhost:3000`

3. You should see the login page without any Firebase errors

## Troubleshooting

### Firebase Auth Error

If you see "Firebase: Error (auth/invalid-api-key)", make sure:

-   Your `.env.local` file exists in the project root
-   All environment variables are correctly set
-   You've restarted the development server after adding the environment variables

### Missing Environment Variables

The application will show warnings in the console if environment variables are missing. Make sure all required variables are set in your `.env.local` file.

### Firestore Permission Errors

If you get permission errors when trying to read/write data:

-   Check that your Firestore security rules are correctly set
-   Make sure you're authenticated before trying to access data
-   Verify that your user has the correct role permissions

## Security Best Practices

1. **Never commit your `.env.local` file** - it should be in your `.gitignore`
2. **Use environment variables** for all sensitive configuration
3. **Set up proper Firestore security rules** to protect your data
4. **Enable authentication** before allowing data access
5. **Regularly review your Firebase project settings** and security rules

## Production Deployment

When deploying to production:

1. **Vercel**: Add the environment variables in your Vercel project settings
2. **Netlify**: Add the environment variables in your Netlify site settings
3. **Firebase Hosting**: Use Firebase CLI to set environment variables

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Firebase configuration is correct
3. Ensure all environment variables are set
4. Check that your Firestore security rules are properly configured

For additional help, refer to the [Firebase Documentation](https://firebase.google.com/docs) or create an issue in the project repository.
