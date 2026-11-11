# SENTINEL

## Manual de usuario
Gestión · Seguimiento · Trazabilidad

## Aplicación React

La aplicación funcional está organizada en `src/`: `components/` contiene la navegación, autenticación y formularios; `pages/` reúne dashboard, incidentes, seguimiento, analítica y ayuda; `lib/` centraliza Supabase y las operaciones de datos.

### Ejecutar localmente

Requiere Node.js 20 o posterior. Desde esta carpeta:

```powershell
npm install
npm run dev
```

Para generar y probar la versión de producción, ejecuta `npm run build` y después `npm run preview`.

### Conectar Supabase

La aplicación conserva la URL y la clave **publicable** que ya utilizaba el proyecto. Para usar otro proyecto, copia `.env.example` a `.env.local` y reemplaza `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. No incluyas una clave `service_role` en el frontend.

En un proyecto nuevo ejecuta `supabase.sql`; en una base existente aplica `supabase_requests_migration.sql`. Después, autoriza analistas desde Supabase SQL Editor:

```sql
insert into public.analyst_access (user_id)
values ('UUID-DEL-USUARIO');
```

Las cuentas nuevas se crean con el formulario de acceso y la confirmación de correo depende de la configuración de Authentication en Supabase. Los nombres de `public.analysts` son ejemplos y deben sustituirse por el directorio real.

### Funcionalidades conectadas

- Registro, consulta, edición y eliminación de reportes propios.
- Inicio de sesión, registro y cierre de sesión con Supabase Auth.
- Clasificación, asignación, diagnóstico y actualización de estado para analistas autorizados.
- Búsqueda, filtros, exportación CSV, panel de seguimiento e historial de diagnósticos.
- Dashboard y métricas calculados con datos permitidos por las políticas RLS; la ayuda está disponible sin sesión.

Las acciones también están restringidas por RLS y por la base de datos. El formulario no adjunta archivos; comparte evidencia sensible solo por los canales aprobados por tu organización.

PROGRAMA: DESARROLLO DE SOFTWARE
INSTITUCIÓN: COMPUSTUDIO
AÑO: 2026

### EQUIPO DE DESARROLLO

- Lizeth Valeria Cuervo Moreno
- Juan Jose Hoyos Gutierrez
- Samuel Villa
- Luisa Fernanda Restrepo Saldarriaga
- Luis David Rincon Arenas
Documento académico preliminar · 2026

## Control del documento
Campo

Información

Aplicación

SENTINEL

Nombre

Sistema de Gestión de Incidentes de Seguridad

Versión

1.0 – Implementación inicial

Estado

Aplicación React funcional conectada a Supabase; requiere configurar y validar el proyecto de base de datos para cada despliegue.

Público objetivo

Reportantes, técnicos y administradores de empresas y organizaciones

## 1. Introducción
SENTINEL es una aplicación web para centralizar el registro, clasificación, asignación y seguimiento de incidentes de seguridad informática.

La solución facilita la coordinación entre quienes reportan incidentes y los responsables de atenderlos, y permite conservar un historial de los casos y de las acciones documentadas.

### 1.1 Propósito del manual
Orientar a las personas usuarias en el uso de SENTINEL mediante instrucciones claras para registrar, consultar y atender reportes.

### 1.2 Alcance

- Registro de incidentes y creación de tickets.
- Clasificación de incidentes según su naturaleza y especialidad.
- Asignación de tickets a áreas o responsables.
- Seguimiento de la atención y actualización de estados.
- Documentación de acciones y soluciones.
- Cierre y consulta del historial de incidentes.

## 2. Requisitos de uso
Requisito

Descripción

Dispositivo

Computador, portátil o dispositivo compatible.

Navegador

Google Chrome, Microsoft Edge o Mozilla Firefox actualizado.

Conectividad

Conexión estable a internet, si la aplicación está desplegada en línea.

Acceso

Cuenta registrada en Supabase Authentication. El acceso a los diagnósticos requiere autorización de analista.

Visualización

Se recomienda una pantalla de computador para facilitar la lectura de formularios y tablas.

La aplicación se ejecuta localmente con Node.js y Vite; para consultar o registrar incidentes requiere conexión a Supabase.

## 3. Acceso al sistema
Para acceder a los incidentes, el usuario deberá:

1. Abrir un navegador web compatible.
2. Ingresar al enlace oficial de SENTINEL.
3. Esperar a que cargue la pantalla inicial.
4. Ingresar sus credenciales o crear una cuenta desde el formulario.
5. Confirmar el correo si Authentication lo requiere y luego iniciar sesión.
6. Utilizar las opciones habilitadas para su perfil. El centro de ayuda está disponible sin sesión.

## 4. Interfaz principal
La interfaz principal reúne los siguientes módulos:

- Panel principal o dashboard.
- Gestión y consulta de tickets.
- Registro de incidentes.
- Asignación de responsables.
- Seguimiento y resolución.
- Historial de incidentes.
- Centro de ayuda y orientación de severidad.
- Estadísticas calculadas a partir de los reportes visibles.

El registro no permite adjuntar archivos. Las métricas se calculan sobre los incidentes que las políticas RLS permiten consultar.

## 5. Perfiles de usuario

### 5.1 Administrador
El administrador configura cuentas, roles y directorios desde Supabase; la aplicación no incluye una pantalla administrativa independiente.

- Autorizar analistas en `public.analyst_access`.
- Mantener los responsables asignables en `public.analysts`.
- Configurar Supabase Authentication y las políticas de acceso.

### 5.2 Reportante
Persona que informa una situación de seguridad y consulta el avance de sus reportes.

- Registrar nuevos incidentes.
- Consultar sus tickets y el estado correspondiente.
- Ampliar información cuando el proceso lo permita.

### 5.3 Técnico de seguridad
La implementación actual no tiene un perfil técnico separado. Las funciones de atención y actualización descritas aquí requieren una cuenta autorizada como analista.
Los permisos se aplican en el frontend y se hacen cumplir en la base de datos mediante RLS.

### 5.4 Analista autorizado
Las acciones de diagnóstico aparecen para cuentas incluidas por un administrador en `public.analyst_access`. En un proyecto nuevo, ejecuta `supabase.sql`; en una base existente, aplica `supabase_requests_migration.sql`. Después, desde el SQL Editor de Supabase, autoriza cada cuenta usando su UUID de Authentication → Users:

```sql
insert into public.analyst_access (user_id)
values ('UUID-DEL-USUARIO');
```

Los analistas autorizados pueden revisar los reportes visibles por RLS, clasificar el incidente, registrar el diagnóstico, asignar un responsable y actualizar su estado. Los reportantes pueden consultar, editar los datos descriptivos y eliminar sus propios reportes, pero no pueden cambiar el estado ni el diagnóstico. Los responsables asignables provienen de `public.analysts`; los nombres incluidos en el SQL inicial son ejemplos y deben reemplazarse por el directorio real.

## 6. Funcionalidades del sistema

### 6.1 Registro de incidentes
Permite reportar una situación que pueda afectar la seguridad de la información o la disponibilidad de un servicio.

1. Iniciar sesión.
2. Seleccionar **Registrar incidente**.
3. Completar el título, la severidad inicial y la descripción; el origen es opcional.
4. Confirmar el registro y conservar el código generado.

La categoría, asignación y diagnóstico los registra después un analista autorizado. La carga de archivos no está implementada.

### 6.2 Clasificación de incidentes
Los analistas autorizados pueden organizar los reportes según su naturaleza para facilitar su atención.

Las categorías disponibles son phishing, malware, acceso no autorizado, fuga de datos, disponibilidad y otro.

### 6.3 Asignación de tickets
Permite dirigir un incidente a un responsable disponible en `public.analysts`.

1. Abrir **Incidentes** y seleccionar el reporte.
2. Revisar su descripción y clasificación.
3. Elegir un responsable de la lista configurada en Supabase.
4. Guardar los cambios desde el panel de analista del detalle.

### 6.4 Seguimiento de incidentes
Permite consultar el estado, los datos y las entradas de diagnóstico guardadas para cada caso.

1. Abrir el ticket que se desea consultar.
2. Revisar el estado y los datos del incidente.
3. Si eres analista autorizado, actualiza el diagnóstico, la prioridad, la categoría, el responsable o el estado.
4. Guarda los cambios para añadir la entrada de diagnóstico al historial.

### 6.5 Solución y cierre
Un analista autorizado puede documentar los hallazgos y cambiar el estado a resuelto cuando corresponda.

1. Abrir el incidente desde **Incidentes**.
2. Revisar la información del incidente.
3. Escribir los hallazgos o acciones en el diagnóstico.
4. Seleccionar el estado correspondiente y guardar los cambios.

### 6.6 Historial de incidentes
Permite consultar los incidentes y el historial de diagnósticos guardado durante su atención.

1. Abrir **Incidentes** y buscar o filtrar el caso.
2. Seleccionar el código para abrir **Seguimiento**.
3. Consultar sus datos, estado, responsable, diagnóstico e historial disponible.

## 7. Ejemplo práctico

### Caso: posible acceso no autorizado
Situación de ejemplo: una persona usuaria detecta actividad sospechosa en una cuenta corporativa y necesita informar el caso al equipo responsable.

1. Ingresar a SENTINEL.
2. Crear un nuevo incidente y elegir una severidad inicial.
3. Describir qué ocurrió, cuándo se detectó y qué servicio o cuenta podría estar afectado.
4. Enviar el reporte y conservar el código generado.
5. El analista autorizado revisa y clasifica el caso, asigna un responsable, documenta el diagnóstico y actualiza su estado.

## 8. Problemas frecuentes
Situación

Recomendación

No permite ingresar

Verificar credenciales y que la cuenta esté habilitada. Si persiste, contactar al administrador.

No se puede registrar un ticket

Comprobar que los campos obligatorios estén completos y que la conexión funcione.

No aparece un incidente

Revisar filtros, criterios de búsqueda y permisos del perfil.

No se puede actualizar un ticket

Verificar permisos y que el estado permita la operación.

No se visualiza el historial

Revisar filtros y rango de búsqueda; solicitar apoyo al administrador si continúa.

## 9. Conclusiones y recomendaciones de uso
SENTINEL ofrece un entorno centralizado para gestionar incidentes de seguridad. Su utilidad depende de que las personas registren información clara, mantengan actualizados los reportes y documenten las acciones realizadas.

- Registrar incidentes con información clara, precisa y oportuna.
- Seleccionar la categoría que mejor describa la situación.
- Evitar compartir contraseñas o datos sensibles innecesarios en descripciones o evidencias.
- Asignar cada caso al responsable autorizado.
- Actualizar los avances y documentar la solución.
- Consultar el historial para dar continuidad a los casos.
- Proteger las credenciales y cerrar la sesión en dispositivos compartidos.

## 10. Control de actualización del manual
Versión

Estado

Descripción

1.0

Implementación inicial

Manual actualizado para las funciones incluidas en la aplicación React.

Validación de despliegue

Pendiente

Configurar y probar Supabase, sus políticas RLS, Authentication y el directorio real de analistas.

SENTINEL | Compuestudio | Desarrollo de Software | 2026
