# KollektivAlert Stockholm 🚇🚨

**KollektivAlert Stockholm** es una plataforma colaborativa en tiempo real para reportar y visualizar incidentes, retrasos, trängsel (aglomeraciones), problemas de accesibilidad y eventos en la red de transporte público de Estocolmo (SL - Tunnelbana, Pendeltåg, Tvärbanan, Bussar, Spårvagn y Båtar).

### 🟢 100% Libre de API Keys
- **Sin API Keys**: La aplicación **no requiere ninguna clave API ni cuenta de pago** para funcionar.
- **Mapas libres**: Emplea Leaflet con teselas abiertas de OpenStreetMap y CartoDB (totalmente públicas y gratuitas).
- **Geolocalización nativa**: Utiliza la API W3C estándar de tu propio navegador (`navigator.geolocation`).
- **Datos de transporte locales**: Las líneas y estaciones de Estocolmo están integradas directamente en el proyecto.
- **Persistencia local**: Funciona en GitHub Pages mediante `localStorage` y `BroadcastChannel` sin requerir bases de datos externas de pago.

---

## 🚀 Publicar en GitHub Pages (Guía Paso a Paso)

La aplicación ha sido optimizada con una **arquitectura híbrida inteligente**:
- Funciona como una **Single Page App (SPA) autónoma** en GitHub Pages con almacenamiento en `localStorage`, sincronización instantánea entre pestañas vía `BroadcastChannel`, motor de expiración automática y exportación/importación en JSON.
- También incluye un backend Node.js/Express (`server.ts`) para entornos full-stack (Cloud Run, Railway, Render, etc.) con Server-Sent Events (SSE).

### 🌟 Solución al problema de carga en GitHub Pages

Si al abrir tu enlace de GitHub Pages la pantalla se queda en blanco o da error 404, se debe a que **GitHub por defecto intenta servir el código fuente (`index.html` con TypeScript sin compilar)** en lugar de la versión compilada.

Tienes **dos formas garantizadas** de resolverlo:

---

#### Método 1: Despliegue directo con la carpeta `/docs` (¡El más rápido, sin configurar Actions!)

Ya hemos dejado pre-compilada y lista la carpeta `/docs` en este repositorio con los archivos estáticos listos para producción.

1. Sube los cambios a tu repositorio:
   ```bash
   git add .
   git commit -m "fix: configurar despliegue para GitHub Pages"
   git push origin main
   ```
2. En GitHub, ve a tu repositorio > **Settings** (Configuración) > **Pages** (menú izquierdo).
3. En **Build and deployment**:
   - **Source**: Selecciona `Deploy from a branch`.
   - **Branch**: Selecciona `main` y en la carpeta elige **/docs**.
   - Haz clic en **Save** (Guardar).
4. Espera ~1 minuto y recarga tu URL de GitHub Pages. ¡Cargará de inmediato!

---

#### Método 2: Despliegue automático con GitHub Actions

El flujo de trabajo automatizado en `.github/workflows/deploy.yml` compilará la aplicación cada vez que hagas `git push`:

1. Ve a tu repositorio en GitHub > **Settings** > **Pages**.
2. En **Build and deployment** > **Source**, cambia el desplegable a **GitHub Actions**.
3. Haz cualquier `git push` o ve a la pestaña **Actions** en tu repositorio y haz clic en **Deploy KollektivAlert to GitHub Pages** > **Run workflow**.
4. El proceso compilará automáticamente los archivos con las rutas relativas correctas, soporte para `.nojekyll` y redirección SPA (`404.html`).

---

## 🛠️ Características Principales

1. **Mapa Interactivo Esquemático:**
   - Visualización de líneas (Verde, Roja, Azul, Pendeltåg, Tvärbanan) con nodos interactivos para estaciones como T-Centralen, Odenplan, Slussen, Fridhemsplan, etc.
   - Puntos de calor e indicadores pulsantes de incidencias activas.
   - Filtros por modo de transporte y severidad.

2. **Reportes Colaborativos:**
   - Selección guiada de categorías: *Driftstörning* (retrasos, cancelaciones), *Säkerhet* (seguridad, emergencias), *Fordon* (trängsel, calefacción), *Station* (escaleras mecánicas, ascensores), *Väder* (nieve, hielo).
   - Cálculo automático de confianza comunitaria basado en reputación y confirmaciones.

3. **Panel de Administración y Moderación:**
   - Botón de **Simular Händelse**: genera incidentes de prueba realistas para demostraciones.
   - **Exportera / Importera JSON**: descarga o restaura la base de datos completa de reportes.
   - **Återställ / Töm**: restablece datos de demostración o limpia para inicio de operación real.
   - Gestión y creación de categorías personalizadas.

4. **Multi-idioma:**
   - Soporte completo para Sueco (`sv`), Inglés (`en`) y Español (`es`).

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo con backend Express + Vite HMR
npm run dev

# Compilar para producción (Frontend dist + Backend server.cjs)
npm run build
```
