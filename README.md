# NexoTasks

### Organiza tu día. Alcanza tus objetivos.

**NexoTasks** es una aplicación web SPA (Single Page Application) para
la gestión organizada de tareas personales y laborales. Permite a los
usuarios registrarse, autenticarse, administrar sus actividades y
recibir por correo electrónico un resumen actualizado de sus tareas.

El proyecto fue desarrollado como parte del **Proyecto Integrador del
Módulo 4 (M4)**, aplicando tecnologías modernas de desarrollo Full
Stack, arquitectura modular, persistencia en la nube, seguridad, testing
automatizado y despliegue en producción.

```{=html}
<p align="center">
```
`<a href="https://nexotasks-m4.vercel.app/">`{=html} `<strong>`{=html}🌐
Ver aplicación en producción`</strong>`{=html} `</a>`{=html} \|
`<a href="https://github.com/jhonfy3320/Proyecto-M4-Jhon-Freddy-Tavera-Blandon">`{=html}
`<strong>`{=html}📁 Repositorio GitHub`</strong>`{=html} `</a>`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## 1. Descripción del proyecto

MateCode es una startup orientada al desarrollo de aplicaciones web para
pequeñas empresas. En este contexto, se plantea la necesidad de
construir una solución que permita a los empleados gestionar sus tareas
diarias de manera organizada, segura, persistente y accesible desde
diferentes dispositivos.

Para responder a esta necesidad se desarrolló **NexoTasks**, una
aplicación que utiliza React y TypeScript en el frontend, Firebase como
plataforma Backend as a Service (BaaS), AWS Simple Email Service (SES)
para las notificaciones por correo electrónico y Vercel para el
despliegue de la aplicación y la ejecución de funciones serverless.

La solución permite que cada usuario disponga de un espacio personal de
trabajo, donde puede administrar sus actividades sin acceder a la
información de otros usuarios.

El desarrollo se realizó de manera incremental, mediante nueve hitos de
trabajo, priorizando la separación de responsabilidades, el tipado
estricto, la seguridad de los datos, la validación de funcionalidades y
la documentación técnica.

### Objetivo general

Desarrollar una aplicación web SPA de gestión de tareas que permita
registrar y autenticar usuarios, administrar actividades mediante
operaciones CRUD, almacenar información de manera persistente en Cloud
Firestore y enviar resúmenes por correo electrónico mediante AWS SES,
utilizando una arquitectura segura, modular y desplegada en producción.

### Objetivos específicos

-   Implementar interfaces reutilizables mediante React y JSX.
-   Aplicar TypeScript para definir modelos de datos y contratos entre
    componentes y servicios.
-   Implementar autenticación con Firebase Authentication.
-   Gestionar rutas públicas y privadas mediante React Router.
-   Construir operaciones CRUD sobre Cloud Firestore.
-   Garantizar el aislamiento de información mediante reglas de
    seguridad y propiedad de los documentos.
-   Implementar sincronización en tiempo real mediante `onSnapshot`.
-   Integrar AWS SES mediante una función serverless ejecutada en
    Vercel.
-   Proteger credenciales y operaciones administrativas mediante
    variables de entorno.
-   Validar el comportamiento de la aplicación mediante Vitest y React
    Testing Library.
-   Publicar la aplicación en Vercel y documentar el proceso de
    desarrollo.

------------------------------------------------------------------------

## 2. Aplicación en producción

  ----------------------------------------------------------------------------------------------------------
  Recurso                             Dirección
  ----------------------------------- ----------------------------------------------------------------------
  Aplicación web                      https://nexotasks-m4.vercel.app

  Repositorio GitHub                  https://github.com/jhonfy3320/Proyecto-M4-Jhon-Freddy-Tavera-Blandon

  Plataforma de despliegue            Vercel

  Proyecto Firebase                   `m4jhon-freddy-tavera-blandon`
  ----------------------------------------------------------------------------------------------------------

La aplicación se encuentra desplegada y accesible públicamente mediante
HTTPS.

El frontend y la función serverless de envío de correo se ejecutan desde
el mismo proyecto de Vercel.

------------------------------------------------------------------------

## 3. Funcionalidades implementadas

### 3.1. Autenticación de usuarios

La aplicación utiliza Firebase Authentication para gestionar las
identidades de los usuarios.

Funcionalidades:

-   Registro mediante correo electrónico y contraseña.
-   Inicio de sesión con credenciales existentes.
-   Cierre de sesión.
-   Persistencia de sesión mediante `browserLocalPersistence`.
-   Observación del estado de autenticación mediante
    `onAuthStateChanged`.
-   Validación de formularios.
-   Manejo y traducción de errores de Firebase.
-   Verificación del correo electrónico del usuario.

La autenticación permite identificar a cada usuario mediante su UID de
Firebase, utilizado posteriormente para controlar el acceso a sus
tareas.

### 3.2. Navegación y rutas protegidas

Se implementó navegación SPA mediante React Router.

Rutas principales:

  Ruta          Descripción                  Acceso
  ------------- ---------------------------- --------------------
  `/`           Página de inicio             Público
  `/login`      Inicio de sesión             Público sin sesión
  `/register`   Registro de usuarios         Público sin sesión
  `/tasks`      Panel de gestión de tareas   Privado
  `*`           Página no encontrada         Público

Se implementaron los componentes `ProtectedRoute` y `PublicOnlyRoute`.

El primero impide que los usuarios no autenticados accedan al panel de
tareas. El segundo evita que usuarios autenticados regresen
innecesariamente a las páginas de inicio de sesión y registro.

También se controla el estado inicial de autenticación para evitar
redirecciones prematuras mientras Firebase verifica la sesión.

### 3.3. Gestión de tareas (CRUD)

NexoTasks permite realizar las siguientes operaciones:

-   **Create:** crear nuevas tareas con título y descripción.
-   **Read:** consultar las tareas del usuario autenticado.
-   **Update:** editar el título, la descripción y el estado de una
    tarea.
-   **Delete:** eliminar tareas mediante una confirmación previa.
-   **Complete:** marcar tareas como completadas o pendientes.

Las operaciones se realizan sobre Cloud Firestore.

Cada documento queda asociado al UID del usuario que lo creó,
permitiendo establecer la propiedad de la información.

### 3.4. Sincronización en tiempo real

Se utiliza `onSnapshot` de Firebase Firestore para recibir
automáticamente las modificaciones realizadas sobre las tareas.

Esto permite que la interfaz se actualice sin necesidad de recargar la
página.

La suscripción se administra desde el hook personalizado `useTasks`,
utilizando `useEffect` y una función de limpieza (`unsubscribe`) para
evitar suscripciones innecesarias y posibles memory leaks.

También se implementan estados de:

-   Carga.
-   Error de consulta.
-   Error de modificación.
-   Operación en progreso.

### 3.5. Notificaciones por correo electrónico

NexoTasks permite enviar al correo electrónico del usuario autenticado
un resumen actualizado de sus tareas.

La integración utiliza AWS SES mediante una función serverless de
Vercel.

El correo contiene:

-   Número total de tareas.
-   Cantidad de tareas completadas.
-   Cantidad de tareas pendientes.
-   Detalle individual de las actividades.
-   Descripción y estado de cada tarea.

Antes de permitir el envío, se comprueba que el correo electrónico del
usuario esté verificado.

El destinatario se obtiene desde Firebase Authentication en el backend y
no desde información proporcionada por el navegador.

------------------------------------------------------------------------

## 4. Tecnologías y herramientas utilizadas

El proyecto utiliza el siguiente stack tecnológico:

  -----------------------------------------------------------------------
  Tecnología                          Función dentro del proyecto
  ----------------------------------- -----------------------------------
  React 19                            Construcción de interfaces y
                                      componentes

  TypeScript                          Tipado estático y definición de
                                      contratos

  Vite 8                              Herramienta de desarrollo y
                                      compilación

  React Router DOM 7                  Navegación SPA y rutas protegidas

  Firebase 13                         Servicios de backend administrado

  Firebase Authentication             Registro, login y sesiones

  Cloud Firestore                     Base de datos NoSQL en la nube

  Firebase Admin SDK 14               Verificación de identidad y
                                      operaciones administrativas

  AWS SES v2                          Envío de correos electrónicos

  AWS SDK for JavaScript              Comunicación con AWS SES

  Vercel                              Despliegue y ejecución serverless

  Vitest 5                            Pruebas automatizadas

  React Testing Library               Pruebas de componentes

  user-event                          Simulación de interacciones de
                                      usuario

  jsdom                               Entorno DOM para pruebas

  Oxlint                              Análisis estático del código

  Git                                 Control de versiones

  GitHub                              Repositorio remoto
  -----------------------------------------------------------------------

Las versiones declaradas de las dependencias se encuentran en
`package.json` y `package-lock.json`.

------------------------------------------------------------------------

## 5. Arquitectura de la aplicación

Se adoptó una arquitectura modular organizada por responsabilidades y
funcionalidades.

La estructura separa la presentación, la lógica de negocio, los
servicios externos, la autenticación y la gestión de tareas.

### 5.1. Diagrama general de arquitectura

``` mermaid
flowchart TD
    U[Usuario] --> SPA[React SPA]
    SPA --> ROUTER[React Router]
    ROUTER --> AUTH[Firebase Authentication]
    ROUTER --> TASKS[Panel de tareas]

    TASKS --> HOOK[useTasks]
    HOOK --> SERVICE[Tasks Service]
    SERVICE --> FS[Cloud Firestore]

    TASKS --> EMAIL[TaskSummaryButton]
    EMAIL --> API[Vercel Function]
    API --> ADMIN[Firebase Admin SDK]
    ADMIN --> AUTH
    ADMIN --> FS
    API --> SES[AWS SES v2]
    SES --> MAIL[Correo electrónico]
```

### 5.2. Estructura de carpetas

``` text
Proyecto-M4Jhon-Freddy-Tavera-Blandon/
│
├── api/
│   └── send-task-summary.ts
│
├── server/
│   ├── firebaseAdmin.ts
│   ├── emailRateLimit.ts
│   └── taskSummary.ts
│
├── src/
│   │
│   ├── app/
│   │   └── providers/
│   │       └── AuthProvider.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── AuthPanel.tsx
│   │   │   ├── context/
│   │   │   │   └── AuthContext.ts
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   └── utils/
│   │   │
│   │   ├── email/
│   │   │   ├── components/
│   │   │   │   └── TaskSummaryButton.tsx
│   │   │   └── services/
│   │   │       └── email.service.ts
│   │   │
│   │   └── tasks/
│   │       ├── components/
│   │       │   ├── TaskForm.tsx
│   │       │   ├── TaskItem.tsx
│   │       │   └── TaskList.tsx
│   │       ├── hooks/
│   │       │   └── useTasks.ts
│   │       ├── services/
│   │       │   └── tasks.service.ts
│   │       ├── types/
│   │       │   └── task.ts
│   │       └── utils/
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── TasksPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicOnlyRoute.tsx
│   │
│   ├── services/
│   │   └── firebase/
│   │       ├── app.ts
│   │       ├── auth.ts
│   │       └── firestore.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── tests/
│   ├── AuthPanel.test.tsx
│   ├── TaskForm.test.tsx
│   ├── TaskList.test.tsx
│   ├── TaskSummaryButton.test.tsx
│   ├── useTasks.test.tsx
│   ├── email.service.test.ts
│   ├── emailEndpoint.test.ts
│   ├── taskSummary.test.ts
│   ├── taskValidation.test.ts
│   ├── firestore.rules.test.ts
│   └── setup.ts
│
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── vercel.json
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.server.json
├── vite.config.ts
│
└── README.md
```

### 5.3. Responsabilidad de las capas

**components:** contiene los elementos reutilizables de interfaz.

**pages:** representa las vistas principales de la aplicación.

**features:** agrupa la lógica y los componentes de cada dominio
funcional: autenticación, tareas y correo electrónico.

**services:** centraliza las operaciones de comunicación con Firebase y
los servicios externos.

**hooks:** contiene hooks personalizados para reutilizar lógica de
autenticación y gestión de tareas.

**types:** define interfaces y tipos compartidos.

**utils:** concentra validaciones y transformaciones reutilizables.

**routes:** controla el acceso a las rutas públicas y privadas.

**api:** contiene las funciones serverless ejecutadas por Vercel.

**server:** contiene la lógica administrativa que se ejecuta
exclusivamente en el backend.

**tests:** agrupa las pruebas automatizadas.

------------------------------------------------------------------------

## 6. Modelo de datos de tareas

Se definió el modelo `Task` utilizando TypeScript.

Archivo: `src/features/tasks/types/task.ts`

``` typescript
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

También se definieron:

-   `TaskDocument`: representación del documento almacenado en
    Firestore, sin el ID del documento.
-   `CreateTaskInput`: campos necesarios para crear una tarea.
-   `UpdateTaskInput`: campos que pueden modificarse.

### 6.1. Estructura del documento Firestore

Colección:

``` text
tasks/
```

Campos:

  Campo           Tipo        Descripción
  --------------- ----------- ------------------------
  `userId`        string      UID del propietario
  `title`         string      Título de la tarea
  `description`   string      Descripción
  `completed`     boolean     Estado de finalización
  `createdAt`     timestamp   Fecha de creación
  `updatedAt`     timestamp   Última actualización

El ID de la tarea corresponde al identificador del documento de
Firestore.

### 6.2. Validaciones

Se establecieron las siguientes restricciones:

-   El título es obligatorio.
-   El título no puede superar 120 caracteres.
-   La descripción no puede superar 2000 caracteres.
-   Los espacios al inicio y al final se eliminan mediante
    normalización.
-   Una tarea nueva se crea inicialmente como pendiente.
-   El propietario y las fechas se generan desde el servicio.

### 6.3. Índice de Firestore

Se configuró un índice compuesto para la consulta de tareas:

  Campo         Orden
  ------------- -------------
  `userId`      Ascendente
  `createdAt`   Descendente

Esto permite consultar las tareas de un usuario y ordenarlas por fecha
de creación.

------------------------------------------------------------------------

## 7. Seguridad y protección de datos

La seguridad se implementó como una responsabilidad transversal de la
aplicación.

No se depende únicamente de la protección de rutas de React para
controlar el acceso a la información.

### 7.1. Firebase Authentication

Cada usuario dispone de un UID único que identifica su sesión.

El estado de autenticación se mantiene mediante `onAuthStateChanged`, y
los servicios de tareas utilizan el UID para asociar las operaciones al
usuario correspondiente.

### 7.2. Cloud Firestore Security Rules

Se implementaron reglas de seguridad en `firestore.rules`.

Las reglas permiten:

-   Consultar únicamente tareas propias.
-   Crear tareas asociadas al UID autenticado.
-   Modificar solamente los campos autorizados.
-   Eliminar únicamente documentos propios.
-   Rechazar documentos con campos o tipos inválidos.
-   Impedir que el propietario modifique el campo `userId`.
-   Impedir que se modifique `createdAt`.

El acceso se concede cuando:

``` javascript
request.auth.uid == resource.data.userId
```

Para la creación se verifica que el UID del documento coincida con el
usuario autenticado.

Se aplicó el principio de denegación por defecto para los recursos que
no están expresamente autorizados.

### 7.3. Protección del backend

La función serverless utiliza Firebase Admin SDK para verificar los
tokens de autenticación.

Se comprueba:

-   Existencia del encabezado Authorization.
-   Validez del token Firebase.
-   Estado de revocación de la sesión.
-   Existencia del usuario.
-   Verificación del correo electrónico.

La consulta de tareas se realiza utilizando el UID verificado en el
servidor.

Esto es especialmente importante porque Firebase Admin SDK opera con
privilegios administrativos y no depende de las reglas de acceso del
cliente.

### 7.4. Protección de credenciales

Las credenciales administrativas de Firebase y AWS se manejan mediante
variables de entorno del servidor.

No se incluyen claves privadas en el frontend ni en el repositorio
GitHub.

El archivo `.env` está excluido mediante `.gitignore`.

El archivo `.env.example` contiene únicamente los nombres de las
variables y valores de referencia.

------------------------------------------------------------------------

## 8. Integración de AWS SES mediante Vercel Functions

El envío de correos se diseñó mediante una arquitectura intermediaria.

El navegador no establece comunicación directa con AWS SES ni conoce sus
credenciales.

### 8.1. Flujo de envío

1.  El usuario autenticado solicita el resumen desde
    `TaskSummaryButton`.
2.  El frontend obtiene un ID Token actualizado de Firebase.
3.  El servicio `email.service.ts` realiza una solicitud POST.
4.  La función `api/send-task-summary.ts` recibe la solicitud.
5.  El backend verifica el token mediante Firebase Admin.
6.  Se comprueba que el correo del usuario esté verificado.
7.  Se obtiene el correo real del usuario desde Firebase Authentication.
8.  Se consultan las tareas filtrando por el UID verificado.
9.  Se construye el resumen mediante `server/taskSummary.ts`.
10. Se aplica el control de frecuencia de envío.
11. Se envía el mensaje mediante AWS SES.
12. Se devuelve una respuesta JSON al frontend.
13. La interfaz informa el resultado de la operación.

### 8.2. Endpoint

``` http
POST /api/send-task-summary
```

Encabezado requerido:

``` http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

El endpoint no acepta contenido adicional en el cuerpo de la solicitud.

### 8.3. Respuestas HTTP

  Código   Significado
  -------- ---------------------------------------------------
  200      AWS SES aceptó la solicitud
  400      La solicitud contiene un cuerpo inesperado
  401      No existe una autenticación válida
  403      El correo electrónico no está verificado
  405      Método HTTP no permitido
  413      El resumen supera el tamaño permitido
  429      Se alcanzó el límite de solicitudes
  502      Falló el envío mediante AWS SES
  503      El servicio o su configuración no está disponible

Las respuestas se devuelven en formato JSON y utilizan
`Cache-Control: no-store`.

### 8.4. Control de frecuencia

Se implementó un mecanismo de control de solicitudes por usuario
mediante Firestore y transacciones.

La política contempla:

-   Un intervalo mínimo de 60 segundos entre intentos.
-   Un máximo de 10 intentos durante una ventana de 24 horas.

Los registros se almacenan en:

``` text
emailSendLimits/{uid}
```

Este mecanismo ayuda a reducir el abuso del servicio y los costos
inesperados de envío.

------------------------------------------------------------------------

## 9. Variables de entorno

Para ejecutar el proyecto se requiere configurar las variables de
Firebase y las credenciales administrativas de Firebase y AWS.

### 9.1. Variables del frontend

  Variable                              Descripción
  ------------------------------------- ------------------------------------
  `VITE_FIREBASE_API_KEY`               API Key de Firebase Web
  `VITE_FIREBASE_AUTH_DOMAIN`           Dominio de autenticación
  `VITE_FIREBASE_PROJECT_ID`            ID del proyecto Firebase
  `VITE_FIREBASE_STORAGE_BUCKET`        Bucket del proyecto
  `VITE_FIREBASE_MESSAGING_SENDER_ID`   Sender ID
  `VITE_FIREBASE_APP_ID`                Identificador de la aplicación web

Las variables con prefijo `VITE_` se incorporan al bundle del frontend.
Por esta razón, no deben utilizarse para almacenar secretos.

La API Key de Firebase Web identifica el proyecto, pero la protección
real de los datos depende de Firebase Authentication y Firestore
Security Rules.

### 9.2. Variables privadas del backend

  Variable                        Descripción
  ------------------------------- ---------------------------------------
  `FIREBASE_ADMIN_PROJECT_ID`     Identificador del proyecto Firebase
  `FIREBASE_ADMIN_CLIENT_EMAIL`   Correo de la cuenta de servicio
  `FIREBASE_ADMIN_PRIVATE_KEY`    Clave privada de Firebase Admin
  `AWS_REGION`                    Región de AWS SES
  `AWS_ACCESS_KEY_ID`             Identificador de acceso AWS
  `AWS_SECRET_ACCESS_KEY`         Clave secreta de AWS
  `SES_FROM_EMAIL`                Dirección remitente verificada en SES

Estas variables deben configurarse exclusivamente en el entorno del
servidor.

### 9.3. Archivo `.env.example`

El repositorio contiene una plantilla con la siguiente estructura:

``` env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Firebase Admin - SOLO servidor
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# AWS SES - SOLO servidor
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SES_FROM_EMAIL=
```

**Importante:** los valores anteriores son ejemplos. Deben reemplazarse
localmente por los valores reales correspondientes.

Nunca se debe subir el archivo `.env` al repositorio.

------------------------------------------------------------------------

## 10. Instalación y ejecución local

### 10.1. Requisitos previos

Para trabajar con el proyecto se necesita:

-   Node.js compatible con Vite 8.
-   npm.
-   Git.
-   Cuenta de Firebase.
-   Proyecto Firebase con Authentication y Firestore habilitados.
-   Cuenta AWS con AWS SES configurado.
-   Cuenta de Vercel para el despliegue.
-   Java disponible en el entorno para ejecutar el emulador de
    Firestore.

### 10.2. Clonar el repositorio

``` bash
git clone https://github.com/jhonfy3320/Proyecto-M4-Jhon-Freddy-Tavera-Blandon.git
```

Ingresar a la carpeta:

``` bash
cd Proyecto-M4-Jhon-Freddy-Tavera-Blandon
```

### 10.3. Instalar dependencias

``` bash
npm install
```

### 10.4. Configurar variables de entorno

Crear el archivo `.env` a partir de la plantilla.

En Linux o macOS:

``` bash
cp .env.example .env
```

En Windows PowerShell:

``` powershell
Copy-Item .env.example .env
```

Completar las variables con los valores correspondientes.

Las credenciales administrativas deben mantenerse protegidas y nunca
deben incorporarse al frontend.

### 10.5. Ejecutar la aplicación

``` bash
npm run dev
```

Vite iniciará el servidor de desarrollo.

Dirección local predeterminada:

``` text
http://localhost:5173
```

### 10.6. Compilar para producción

``` bash
npm run build
```

El comando ejecuta:

1.  Verificación de TypeScript mediante `tsc -b`.
2.  Compilación de producción mediante Vite.

Los archivos generados se almacenan en:

``` text
dist/
```

Para revisar localmente la compilación:

``` bash
npm run preview
```

------------------------------------------------------------------------

## 11. Configuración de Firebase

Para reproducir la integración de Firebase se deben realizar los
siguientes pasos:

1.  Crear un proyecto en Firebase.
2.  Registrar una aplicación web.
3.  Obtener la configuración de Firebase Web.
4.  Habilitar el proveedor de autenticación Email/Password.
5.  Crear la base de datos Cloud Firestore.
6.  Configurar las reglas de seguridad.
7.  Configurar el índice compuesto de la colección `tasks`.
8.  Configurar la cuenta de servicio para Firebase Admin.
9.  Agregar los dominios autorizados en Firebase Authentication.

### Despliegue de reglas

Instalar o utilizar Firebase CLI e iniciar sesión:

``` bash
npx firebase login
```

Desplegar las reglas:

``` bash
npx firebase deploy --only firestore:rules --project m4jhon-freddy-tavera-blandon
```

Desplegar los índices:

``` bash
npx firebase deploy --only firestore:indexes --project m4jhon-freddy-tavera-blandon
```

Las reglas y los índices se encuentran definidos en:

``` text
firestore.rules
firestore.indexes.json
```

------------------------------------------------------------------------

## 12. Configuración de AWS SES

Para utilizar el servicio de correo electrónico se requiere:

1.  Disponer de una cuenta AWS.
2.  Seleccionar una región para AWS SES.
3.  Verificar la identidad del remitente.
4.  Configurar permisos IAM con el principio de mínimo privilegio.
5.  Autorizar la operación de envío `ses:SendEmail`.
6.  Configurar las variables privadas de AWS en Vercel.
7.  Verificar las restricciones del entorno de envío.

Si AWS SES se encuentra en modo sandbox, las direcciones destinatarias
también deben cumplir los requisitos de verificación establecidos por
AWS.

El remitente configurado en `SES_FROM_EMAIL` debe corresponder a una
identidad verificada en la misma región utilizada por la función.

La comunicación con AWS se realiza desde el backend mediante
`@aws-sdk/client-sesv2`.

------------------------------------------------------------------------

## 13. Pruebas automatizadas

Se utilizó Vitest junto con React Testing Library para validar el
comportamiento de los componentes, servicios y funcionalidades
principales.

Las pruebas utilizan mocks para simular servicios externos cuando
corresponde, evitando llamadas innecesarias a Firebase y AWS durante la
ejecución de las suites automatizadas.

### 13.1. Herramientas de testing

-   Vitest.
-   React Testing Library.
-   user-event.
-   jsdom.
-   Firebase Rules Unit Testing.

### 13.2. Cobertura funcional

Se desarrollaron pruebas para:

  Archivo de pruebas             Funcionalidad evaluada
  ------------------------------ -----------------------------------------
  `AuthPanel.test.tsx`           Registro, login, validaciones y errores
  `TaskForm.test.tsx`            Formulario y validaciones de tareas
  `TaskList.test.tsx`            Listado, edición, eliminación y estados
  `TaskSummaryButton.test.tsx`   Interacciones y envío de correo
  `useTasks.test.tsx`            Suscripciones, datos y limpieza
  `email.service.test.ts`        Solicitudes HTTP y respuestas
  `emailEndpoint.test.ts`        Autenticación, autorización y AWS SES
  `taskSummary.test.ts`          Generación del resumen
  `taskValidation.test.ts`       Validaciones y normalización
  `firestore.rules.test.ts`      Reglas de seguridad y aislamiento

También se incluyeron pruebas para las rutas protegidas.

### 13.3. Pruebas de seguridad de Firestore

Se utilizó Firebase Emulator Suite para comprobar el comportamiento de
las reglas.

Se validaron escenarios como:

-   Creación de tareas propias.
-   Rechazo de creación a nombre de otro usuario.
-   Lectura de documentos propios.
-   Rechazo de lectura de documentos ajenos.
-   Listado de tareas propias.
-   Actualización y eliminación.
-   Protección de campos inmutables.
-   Rechazo de accesos sin autenticación.

En la ejecución documentada del Hito 8 se obtuvieron 11 pruebas
aprobadas de reglas de Firestore.

### 13.4. Comandos de pruebas

Ejecutar las pruebas unitarias y de componentes:

``` bash
npm run test:unit
```

Ejecutar las pruebas de interfaz ubicadas en `src`:

``` bash
npm run test:ui
```

Ejecutar las pruebas de forma interactiva:

``` bash
npm run test:watch
```

Ejecutar las pruebas de reglas de Firestore:

``` bash
npm run test:rules
```

Ejecutar todas las suites:

``` bash
npm run test:all
```

Ejecutar la verificación de tipos del servidor:

``` bash
npm run typecheck:server
```

Generar un reporte de cobertura:

``` bash
npx vitest run --coverage --exclude tests/firestore.rules.test.ts
```

Para ejecutar las pruebas de reglas se requiere que el entorno tenga
Java disponible y que el emulador de Firestore pueda iniciarse
correctamente.

### 13.5. Validación de calidad

También se utiliza Oxlint para analizar el código:

``` bash
npm run lint
```

Y la compilación completa:

``` bash
npm run build
```

El proceso de validación contempla el análisis estático, la comprobación
de tipos, las pruebas automatizadas y la compilación de producción.

------------------------------------------------------------------------

## 14. Despliegue en Vercel

La aplicación se encuentra desplegada mediante Vercel.

Repositorio conectado:

``` text
Proyecto-M4-Jhon-Freddy-Tavera-Blandon
```

Configuración principal:

  Parámetro           Valor
  ------------------- -----------------
  Framework           Vite
  Root Directory      `./`
  Build Command       `npm run build`
  Output Directory    `dist`
  Production Branch   `main`

### 14.1. Funciones serverless

La función de correo se encuentra en:

``` text
api/send-task-summary.ts
```

La carpeta `api/` permanece en la raíz del repositorio para que Vercel
pueda detectar y desplegar la función.

La lógica administrativa complementaria se encuentra en:

``` text
server/
```

### 14.2. Configuración SPA

El archivo `vercel.json` contiene la configuración de reescritura para
permitir que React Router gestione las rutas de la aplicación.

Esto permite abrir directamente direcciones como:

``` text
/login
/register
/tasks
```

sin que Vercel devuelva un error 404 por desconocer las rutas internas
de React.

### 14.3. Variables de entorno en producción

Las variables deben configurarse desde:

``` text
Vercel
  → Proyecto NexoTasks
    → Settings
      → Environment Variables
```

Las variables del frontend se configuran con su prefijo `VITE_`.

Las credenciales administrativas de Firebase y AWS se configuran
exclusivamente como variables privadas del servidor.

Los cambios en las variables de entorno requieren generar un nuevo
deployment para que estén disponibles en la versión publicada.

### 14.4. Despliegue desde GitHub

El repositorio está conectado con Vercel.

Los cambios publicados en la rama principal `main` pueden generar
automáticamente nuevos deployments de producción.

También es posible realizar un despliegue mediante Vercel CLI:

``` bash
npx vercel --prod
```

------------------------------------------------------------------------

## 15. Verificación del deployment en producción

La aplicación se encuentra disponible en:

**https://nexotasks-m4.vercel.app**

Durante la validación del deployment se realizaron comprobaciones
directas sobre las rutas de la SPA y el endpoint serverless.

### 15.1. Pruebas HTTP del endpoint

  Prueba                       Resultado HTTP   Content-Type
  ---------------------------- ---------------- ------------------
  GET al endpoint              405              application/json
  POST sin token               401              application/json
  POST con cuerpo inesperado   400              application/json

Estos códigos corresponden al comportamiento de seguridad esperado de la
función.

### 15.2. Verificación de rutas SPA

Se comprobó el acceso directo a:

``` text
https://nexotasks-m4.vercel.app/tasks
```

Resultado:

``` text
HTTP 200
Content-Type: text/html; charset=utf-8
```

Esto confirma que la regla de reescritura permite que React Router
gestione la navegación interna.

### 15.3. Verificación funcional

En producción también se comprobó:

-   Acceso a la aplicación mediante HTTPS.
-   Funcionamiento de las rutas de autenticación.
-   Comunicación con Firebase.
-   Gestión de tareas.
-   Envío del resumen mediante AWS SES.
-   Recepción del correo electrónico con el resumen solicitado.

El envío de correo fue probado desde la aplicación desplegada y se
verificó su funcionamiento.

------------------------------------------------------------------------

## 16. Uso de inteligencia artificial durante el desarrollo

La inteligencia artificial se utilizó como herramienta de apoyo al
proceso de desarrollo, principalmente para comprender conceptos, evaluar
alternativas arquitectónicas, revisar código, diseñar pruebas y
diagnosticar errores.

La inteligencia artificial no sustituyó la comprensión del código ni las
decisiones del desarrollador.

Su utilización se realizó de manera progresiva, acompañando los
diferentes hitos del proyecto.

### 16.1. Situaciones en las que se utilizó IA

**1. Diseño de arquitectura**

Se utilizó para analizar la estructura del proyecto y establecer
responsabilidades para componentes, páginas, hooks, servicios, tipos y
funciones serverless.

**2. Desarrollo con React y TypeScript**

Se utilizó como apoyo para comprender componentes reutilizables, props,
estados, formularios controlados, hooks personalizados y tipado de
interfaces.

**3. Integración con Firebase**

Se utilizó para comprender la autenticación, el patrón Observer, la
persistencia de sesión, las reglas de seguridad y la sincronización en
tiempo real.

**4. Implementación de AWS SES**

Se utilizó para estudiar la comunicación entre el frontend y una función
serverless, la protección de credenciales y la verificación del usuario
autenticado.

**5. Testing automatizado**

Se utilizó para diseñar escenarios de pruebas, estructurar mocks y
analizar comportamientos de error en componentes y servicios.

**6. Resolución de problemas en producción**

Se utilizó como apoyo para analizar errores de módulos ESM,
compatibilidad de dependencias y comportamiento de los streams HTTP en
el entorno serverless de Vercel.

### 16.2. Ejemplos representativos de prompts utilizados

**Prompt 1 --- Arquitectura**

> Analiza la estructura actual de mi aplicación React + TypeScript y
> propón una organización modular por responsabilidades. No reescribas
> todo el proyecto. Indica qué archivos deben modificarse, dónde y cuál
> es la responsabilidad de cada uno.

**Prompt 2 --- Firebase**

> Ayúdame a implementar la autenticación con Firebase utilizando
> onAuthStateChanged y Context API. Explica cómo mantener la sesión,
> controlar el estado de carga y limpiar las suscripciones
> correctamente.

**Prompt 3 --- Seguridad**

> Revisa estas reglas de Cloud Firestore y comprueba que un usuario
> solamente pueda leer, crear, actualizar y eliminar sus propias tareas.
> Identifica posibles vulnerabilidades y plantea pruebas con dos
> usuarios diferentes.

**Prompt 4 --- Testing**

> Diseña pruebas con Vitest y React Testing Library para comprobar el
> comportamiento de este componente. Incluye casos exitosos, errores,
> validaciones y mocks de los servicios externos.

**Prompt 5 --- Deployment**

> Analiza estos registros de Vercel e identifica la causa del error.
> Propón una corrección mínima que conserve la arquitectura existente y
> define cómo verificar que el problema quedó resuelto.

### 16.3. Decisiones tomadas a partir del uso de IA

El uso de IA permitió identificar alternativas de implementación, pero
las decisiones finales se verificaron mediante la ejecución del código y
las pruebas correspondientes.

Entre las principales decisiones se encuentran:

-   Separar la lógica de negocio de los componentes de presentación.
-   Centralizar el estado de autenticación.
-   Utilizar hooks personalizados para la gestión de tareas.
-   Proteger los datos mediante reglas de Firestore.
-   Mantener las credenciales administrativas fuera del frontend.
-   Utilizar funciones serverless como intermediarias para AWS SES.
-   Incorporar pruebas con mocks para aislar dependencias externas.
-   Implementar commits pequeños y descriptivos.
-   Validar cada etapa antes de avanzar a la siguiente.

### 16.4. Buenas prácticas descubiertas

Durante el desarrollo se identificó que utilizar IA de manera efectiva
requiere proporcionar contexto suficiente, revisar las propuestas y
comprobar su funcionamiento.

Los principales aprendizajes fueron:

1.  No copiar código generado sin comprender sus responsabilidades.
2.  Solicitar cambios específicos en lugar de reescribir archivos
    completos.
3.  Validar las propuestas mediante pruebas automatizadas.
4.  Separar los problemas de frontend de los problemas del backend.
5.  Revisar los logs reales antes de realizar modificaciones.
6.  Proteger los secretos independientemente de las recomendaciones de
    implementación.
7.  Mantener un historial de cambios que permita identificar cuándo y
    por qué se introdujo cada modificación.

La IA resultó especialmente útil para acelerar el análisis de errores y
estructurar pruebas, mientras que la validación técnica permitió
confirmar que las soluciones fueran correctas.

**Conclusión sobre el uso de IA:** se utilizó como asistente de
desarrollo y aprendizaje, manteniendo el criterio técnico del
desarrollador como responsable de las decisiones y de la validación de
los resultados.

------------------------------------------------------------------------

## 17. Control de versiones y metodología de trabajo

El desarrollo se realizó utilizando Git y GitHub como herramientas de
control de versiones.

Se trabajó mediante hitos y subfases, implementando cambios progresivos
y verificables.

La metodología aplicada fue:

1.  Analizar el requerimiento.
2.  Identificar los archivos involucrados.
3.  Definir la modificación necesaria.
4.  Implementar la funcionalidad.
5.  Ejecutar las pruebas correspondientes.
6.  Revisar lint y build.
7.  Registrar un commit descriptivo.
8.  Continuar con la siguiente funcionalidad.

Se utilizaron mensajes de commit que describen la naturaleza del cambio,
incluyendo categorías como:

-   `feat`: nuevas funcionalidades.
-   `fix`: correcciones.
-   `test`: pruebas automatizadas.
-   `chore`: configuración y mantenimiento.
-   `docs`: documentación.

Esta metodología permitió mantener trazabilidad durante las nueve etapas
del Proyecto Integrador.

------------------------------------------------------------------------

## 18. Alcance y consideraciones de la versión

La versión desarrollada implementa los requisitos funcionales
principales establecidos en la consigna del Proyecto Integrador M4.

La autenticación implementada utiliza correo electrónico y contraseña.

Las funcionalidades adicionales de drag and drop, fechas de vencimiento
y priorización de tareas no forman parte del alcance implementado en
esta versión, dado que corresponden a características opcionales de la
consigna.

La aplicación está orientada a demostrar la integración de frontend,
servicios BaaS, funciones serverless, seguridad, testing y despliegue.

------------------------------------------------------------------------

## 19. Conclusiones

El desarrollo de NexoTasks permitió integrar los conocimientos
adquiridos durante el Módulo 4 en una aplicación web funcional,
desplegada y conectada a servicios reales.

A través de React y TypeScript se construyó una interfaz modular y
adaptable. Firebase permitió implementar autenticación, persistencia y
aislamiento de información mediante reglas de seguridad. AWS SES,
integrado a través de una función serverless de Vercel, permitió
incorporar notificaciones por correo electrónico sin exponer
credenciales en el navegador.

El uso de Vitest y React Testing Library permitió comprobar el
comportamiento de componentes, servicios y operaciones críticas,
mientras que Git y GitHub facilitaron el seguimiento y la trazabilidad
de los cambios.

Uno de los aprendizajes más importantes fue comprender que una
aplicación Full Stack no se limita a conectar tecnologías: requiere
definir responsabilidades, establecer límites de confianza, validar los
datos, proteger las operaciones y comprobar el funcionamiento del
sistema en un entorno real.

NexoTasks representa la aplicación práctica de estos principios y
constituye una demostración de los conocimientos adquiridos durante el
Proyecto Integrador del Módulo 4.

------------------------------------------------------------------------

## 20. Autor

**Desarrollador:** Jhon Freddy Tavera Blandón

**Proyecto académico:** Proyecto Integrador 4

**Módulo:** M4 --- Desarrollo Full Stack

**Startup de contexto:** MateCode

**Nombre de la aplicación:** NexoTasks

**Frontend:** React + TypeScript

**Backend:** Firebase + Vercel Functions

**Servicio de correo:** AWS SES

**Repositorio:** [GitHub - Proyecto
M4](https://github.com/jhonfy3320/Proyecto-M4-Jhon-Freddy-Tavera-Blandon)

**Aplicación en producción:**
[NexoTasks](https://nexotasks-m4.vercel.app)

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}NexoTasks`</strong>`{=html} `<br />`{=html} Organiza tu
día. Alcanza tus objetivos. `<br />`{=html} Proyecto Integrador M4
```{=html}
</p>
```

