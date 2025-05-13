# Admin Setup Instructions

## Firestore Indexes

For the admin page and content functionality to work correctly, you need to create the following Firestore indexes. The easiest way to create them is by clicking on the links in the error messages in your browser console.

### Required Indexes:

1. For Programs Collection:
   - Fields: `isActive` (Ascending), `order` (Ascending)
   - Collection: `programs`
   - Query scope: Collection

2. For Gallery Collection:
   - Fields: `isActive` (Ascending), `order` (Ascending)
   - Collection: `gallery`
   - Query scope: Collection

Alternatively, you can create these indexes manually in the Firebase Console:

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Navigate to Firestore Database → Indexes
4. Click "Add Index"
5. Create the two indexes described above

## Accessing the Admin Page

There are two ways to access the admin page:

1. From the user menu in the top-right corner (click on "Account")
2. By navigating directly to `/admin` in your browser

The admin page is only accessible to users with the role set to "admin" in their Firestore document.

## Using the Admin Page

### Managing Programs:

1. In the "Programs & Schedule" tab, you can:
   - View existing programs
   - Add new programs 
   - Edit existing programs
   - Toggle program visibility (active/inactive)
   - Delete programs

2. Each program has:
   - Title
   - Time
   - Description
   - Icon
   - Order (determines display order)
   - Active status

### Managing Gallery Images:

1. In the "Gallery Images" tab, you can:
   - View existing gallery images
   - Add new images (upload from your device)
   - Edit image details
   - Toggle image visibility (active/inactive)
   - Delete images (this also removes them from Firebase Storage)

2. Each gallery image has:
   - Title
   - Order (determines display order)
   - Active status
   - Image file (stored in Firebase Storage)

## Troubleshooting

If you encounter errors related to:

1. **Missing Indexes**: Create the required indexes as described above
2. **Upload Failures**: Check your Firebase Storage rules to ensure they allow writes
3. **Permissions**: Ensure your user account has the "admin" role in Firestore

For additional help, check the Firebase console for any error messages or contact the development team.