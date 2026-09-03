# Casa Base — CRM prototipo para inmobiliaria

Prototipo funcional de CRM para agencias inmobiliarias. Incluye:

- **Contactos** — prospectos, clientes y propietarios
- **Propiedades** — inventario de inmuebles en venta y renta
- **Pipeline** — tablero de negociaciones por etapa
- **Tareas** — pendientes y seguimientos con fecha límite
- **Calendario** — vista mensual de tareas
- **Reportes** — gráficas de negociaciones, propiedades y valor de pipeline

Construido con **React + Vite**, **Tailwind CSS** y **Firebase Firestore** en tiempo real. Pensado para desplegarse gratis en **GitHub Pages**.

---

## 1. Configurar Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto (o usa uno existente).
2. En **Compilación → Firestore Database**, crea una base de datos (modo producción).
3. En **Compilación → Authentication → Sign-in method**, habilita **Correo/contraseña** y, si quieres el botón de Google, también **Google**. La app ya incluye pantalla de login con ambas opciones.
4. En **Configuración del proyecto → Tus apps**, agrega una app web y copia las credenciales.

### Reglas de Firestore

Este repo incluye `firestore.rules` con reglas básicas que requieren autenticación. Publícalas desde la consola de Firebase (Firestore → Reglas) o con la CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # selecciona tu proyecto
firebase deploy --only firestore:rules
```

Con el login ya activo, las reglas por defecto (`if request.auth != null`) son las que debes usar — solo usuarios que hayan iniciado sesión pueden leer o escribir datos.

---

## 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Rellena `.env` con las credenciales de tu app web de Firebase (API key, project ID, etc). Este archivo **no se sube a GitHub** (ya está en `.gitignore`).

---

## 3. Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

---

## 4. Subir a GitHub

```bash
git init
git add .
git commit -m "CRM inmobiliario inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

---

## 5. Publicar en GitHub Pages (automático)

Este repo incluye un flujo de GitHub Actions (`.github/workflows/deploy.yml`) que compila y publica el sitio en cada push a `main`.

1. **`vite.config.js` ya está configurado** con `base: '/crmvalleverde/'`, listo para este repositorio.
2. **Agrega tus credenciales como Secrets**: en GitHub, ve a `Settings → Secrets and variables → Actions` y crea un secreto por cada variable de `.env.example` (`VITE_FIREBASE_API_KEY`, etc.) con los mismos valores.
3. **Activa GitHub Pages**: en `Settings → Pages`, en "Build and deployment" selecciona **GitHub Actions** como fuente.
4. Haz push a `main` — la Action compilará y publicará automáticamente. Tu sitio quedará en:
   `https://TU-USUARIO.github.io/crmvalleverde/`

---

## Estructura del proyecto

```
src/
  firebase.js              # inicialización de Firebase
  hooks/useCollection.js   # hook genérico de lectura/escritura en tiempo real con Firestore
  layout/                  # sidebar y layout general
  components/ui.jsx        # componentes reutilizables (botones, tarjetas, modal...)
  pages/                   # Dashboard, Contactos, Propiedades, Pipeline, Tareas, Calendario, Reportes
  utils/constants.js       # catálogos (etapas, estados) y formateo
firestore.rules            # reglas de seguridad de ejemplo
.github/workflows/deploy.yml  # despliegue automático a GitHub Pages
```

## Colecciones de Firestore

| Colección    | Campos principales |
|--------------|---------------------|
| `contacts`   | name, email, phone, type, source, notes |
| `properties` | title, address, type, status, price, bedrooms, bathrooms, area, notes |
| `deals`      | contactName, propertyTitle, value, stage |
| `tasks`      | title, dueDate, relatedTo, status |

Todas las colecciones se crean automáticamente la primera vez que agregas un registro desde la app — no necesitas crearlas manualmente en la consola.

## Autenticación

La app incluye login con **correo/contraseña** y **Google** (Firebase Auth). Todas las páginas del CRM están protegidas: si no hay sesión iniciada, se redirige a `/login`. Para crear tu primer usuario, entra a la pantalla de login y usa "Regístrate", o crea el usuario manualmente desde Firebase Console → Authentication → Users.

## Próximos pasos sugeridos

- Filtrar datos por usuario/agente (por ejemplo, que cada quien vea solo sus propios contactos).
- Vincular `deals` con IDs reales de `contacts` y `properties` en vez de texto libre.
- Subir fotos de propiedades con Firebase Storage.
- Exportar reportes a PDF o Excel.
