import { ConfigService } from '@nestjs/config';

/**
 * Configuración disponible fuera del contenedor de Nest (ej. scripts, main.ts antes de crear la app).
 * Nest carga .env con ConfigModule; dentro de la app inyecta ConfigService.
 */
export const standaloneConfigService = new ConfigService(process.env);
