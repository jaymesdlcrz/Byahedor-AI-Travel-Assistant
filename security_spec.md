# Security Specification & Threat Model

## 1. Data Invariants
1. **Identity & Ownership Invariant**: Every document in `/users/{userId}/...` must strictly belong to the authenticated caller (`request.auth.uid == userId`). Cross-user reads, impersonation writes, or creating documents on behalf of other users are strictly blocked.
2. **Immutable Identity Invariant**: Once created, `ownerId` and `userId` fields cannot be altered during updates (`incoming().ownerId == existing().ownerId`).
3. **Temporal Invariant**: The creation timestamp `createdAt` must strictly match the server time (`request.time`) and cannot be modified on update. `updatedAt` must be set to `request.time` on updates.
4. **Volume & Size Protection**: All string fields are constrained with rigorous `.size()` limits (e.g., IDs <= 128 chars, titles <= 200 chars, overviews <= 3000 chars) to prevent Denial-of-Wallet attacks.
5. **No Blind Delegation**: Querying documents via `allow list` requires explicit verification that `resource.data.ownerId == request.auth.uid` or matches `{userId}`.
6. **Strict Field Allowlisting**: Ghost fields and shadow injection attacks are rejected by requiring defined keys and validating allowed update delta fields via `affectedKeys()`.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1: Identity Spoofing (Foreign User Injection)**
   Attempting to write to `/users/alice/savedTrips/trip123` while authenticated as `bob`.
   ```json
   { "id": "trip123", "ownerId": "bob", "title": "Stolen Trip", "destination": "Siargao" }
   ```
   *Expected Result*: PERMISSION_DENIED.

2. **Payload 2: Ghost Field Privilege Escalation**
   Injecting administrative/ghost properties into a saved trip payload.
   ```json
   { "id": "trip123", "ownerId": "alice", "title": "My Trip", "destination": "Bohol", "isAdmin": true, "superUser": true }
   ```
   *Expected Result*: PERMISSION_DENIED.

3. **Payload 3: Denial-of-Wallet Long String Injection**
   Flooding the destination name with a 1MB payload to trigger read/storage quota exhaustion.
   ```json
   { "id": "trip123", "ownerId": "alice", "title": "Trip", "destination": "A".repeat(500000) }
   ```
   *Expected Result*: PERMISSION_DENIED.

4. **Payload 4: Owner ID Mutability Attack (Orphaned Ownership)**
   Attempting to update an existing trip to transfer ownership to another user.
   ```json
   { "ownerId": "charlie" }
   ```
   *Expected Result*: PERMISSION_DENIED.

5. **Payload 5: Client Timestamp Forgery**
   Passing an arbitrary past or future timestamp rather than `request.time`.
   ```json
   { "id": "trip123", "ownerId": "alice", "createdAt": "1999-01-01T00:00:00Z" }
   ```
   *Expected Result*: PERMISSION_DENIED.

6. **Payload 6: Document ID Path Traversal / Poisoning**
   Creating a document with malicious path symbols or length > 128 characters: `../../system/config`.
   ```json
   { "id": "../../system/config", "ownerId": "alice" }
   ```
   *Expected Result*: PERMISSION_DENIED.

7. **Payload 7: Unauthenticated Blanket Snooping**
   Attempting to list or read `/users/alice/savedTrips` without an active auth session (`request.auth == null`).
   *Expected Result*: PERMISSION_DENIED.

8. **Payload 8: Cross-User Profile Tampering**
   Updating `/users/alice/profile/settings` while authenticated as `eve`.
   ```json
   { "userId": "eve", "preferredLanguage": "English", "currency": "USD" }
   ```
   *Expected Result*: PERMISSION_DENIED.

9. **Payload 9: Malformed Type Injection (Type Confusion)**
   Submitting a boolean or array where a positive number is required for `days` or `totalBudget`.
   ```json
   { "id": "trip123", "ownerId": "alice", "days": "not-a-number", "totalBudget": false }
   ```
   *Expected Result*: PERMISSION_DENIED.

10. **Payload 10: Array Flood Attack**
    Attempting to save an unbounded array of 10,000 sub-items in `daysPlan` to exceed Firestore transaction limits.
    ```json
    { "id": "trip123", "ownerId": "alice", "daysPlan": [ ...10000 items ] }
    ```
    *Expected Result*: PERMISSION_DENIED.

11. **Payload 11: Unchecked Checklist Hijacking**
    Writing to `/users/alice/checklistItems/item99` with mismatched `ownerId`.
    ```json
    { "id": "item99", "ownerId": "hacker", "label": "Passport", "isChecked": false }
    ```
    *Expected Result*: PERMISSION_DENIED.

12. **Payload 12: Catch-All Root Document Leak**
    Attempting to access unauthorized root collections such as `/admins` or `/{document=**}`.
    *Expected Result*: PERMISSION_DENIED (Default Deny).
