# Firestore Rules Notes

## Important Notes

### Array of Objects Limitation
Firestore security rules have limitations when checking arrays of objects. The `members` array in projects contains objects like:
```javascript
members: [{uid: "xxx", role: "manager"}, {uid: "yyy", role: "staff"}]
```

### Solution Implemented
Since Firestore rules don't support filtering arrays of objects directly, we use a helper function `isMemberOfProject()` that checks up to 20 members by index. This covers most use cases.

### Limitations
- **Maximum 20 members per project** - If you need more, you'll need to either:
  1. Increase the checks in `isMemberOfProject()` function
  2. Use Cloud Functions for validation
  3. Restructure data to use a map instead of array

### How It Works
The `isMemberOfProject()` function checks each member's `uid` field up to index 19:
```javascript
members[0].uid == request.auth.uid ||
members[1].uid == request.auth.uid ||
// ... up to members[19]
```

### Testing
After deploying these rules, test:
1. User can read their own projects
2. User can read projects they're members of
3. User cannot read projects they're not members of
4. Admin/Manager can create/update products
5. Staff can only create sales

### Deployment
1. Copy the rules from `firestore.rules`
2. Go to Firebase Console > Firestore Database > Rules
3. Paste and click "Publish"
4. Test with Firebase Rules Playground

### Future Improvements
For projects with more than 20 members, consider:
- Using Cloud Functions for complex validations
- Restructuring to use a map: `members: {uid1: {role: "manager"}, uid2: {role: "staff"}}`
- Using a separate `projectMembers` collection
