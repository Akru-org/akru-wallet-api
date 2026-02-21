import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

const FIREBASE_LOG = '[Firebase Admin]';

/**
 * Firebase en el backend usa la cuenta de servicio (Admin SDK), mismo proyecto que el front.
 * En .env del backend define GOOGLE_APPLICATION_CREDENTIALS con la ruta al JSON de la cuenta
 * de servicio (Firebase Console > Project Settings > Service accounts > Generate new private key).
 * No commitear el JSON.
 */
export function initFirebase(credentialsPath: string | undefined): void {
  if (admin.apps.length > 0) return;

  if (!credentialsPath?.trim()) {
    console.warn(
      `${FIREBASE_LOG} GOOGLE_APPLICATION_CREDENTIALS no configurado. PATCH /users/me devolverá 401.`,
    );
    return;
  }

  const resolvedPath = path.isAbsolute(credentialsPath)
    ? credentialsPath
    : path.resolve(process.cwd(), credentialsPath);

  if (!fs.existsSync(resolvedPath)) {
    console.warn(
      `${FIREBASE_LOG} No se encontró el archivo de cuenta de servicio en: ${resolvedPath}. PATCH /users/me devolverá 401.`,
    );
    return;
  }

  try {
    const raw = fs.readFileSync(resolvedPath, 'utf8');
    const serviceAccount: any = JSON.parse(raw) as admin.ServiceAccount;
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log(`${FIREBASE_LOG} Inicializado con proyecto: ${serviceAccount.project_id ?? '(sin project_id)'}`);
  } catch (err) {
    console.error(`${FIREBASE_LOG} Error al cargar la cuenta de servicio:`, (err as Error).message);
  }
}
