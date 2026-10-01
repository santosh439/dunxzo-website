# Test Credentials & Environment Configuration

## Admin Dashboard Credentials
- **URL**: `https://c92d4991-7e6a-46a5-906e-ec749b4dce09.preview.emergentagent.com/admin`
- **ADMIN_TOKEN**: `8c6fc9942fc7f436da7e6b5a20afb7c2a912753da1c754e1`
- Used for `Authorization: Bearer <ADMIN_TOKEN>` to `/api/admin/leads` and `/api/admin/plans`.

## Notification Email
- **Recipient**: `santosh@du-nzo.com`
- Triggered on submissions to `/api/leads` from Contact, Trust Center, and Launchpad.

## MongoDB Connection
- Local preview: `mongodb://localhost:27017`
- Database: `dunzo`
