/*Login
 ↓
Fetch user doc
 ↓
If profileCompleted == false
 → show CompleteProfile page
   → show ClientProfileForm if role.client
   → show ProviderProfileForm if role.provider
   → on submit → save to Firestore
   → set profileCompleted = true
 ↓
Redirect to dashboard */