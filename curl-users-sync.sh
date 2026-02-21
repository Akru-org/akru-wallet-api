#!/usr/bin/env bash
# Probar POST /users/sync
# Requiere: Bearer token de Firebase (ID token) y body con uid + email.

BASE_URL="${BASE_URL:-http://localhost:3000}"
# Sustituir por un ID token válido de Firebase (ej. desde el cliente web o Firebase Auth REST)
FIREBASE_ID_TOKEN="${FIREBASE_ID_TOKEN:-your-firebase-id-token}"

curl -s -X POST "${BASE_URL}/users/sync" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FIREBASE_ID_TOKEN}" \
  -d '{"uid":"test-uid-123","email":"user@example.com"}' \
  | jq .

# Sin jq: quita "| jq ." al final para ver JSON crudo.
