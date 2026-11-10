# SECURITY CHAMP

## MANUAL DE USUARIO
Gestión · Seguimiento · Trazabilidad

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

SECURITY CHAMP

Nombre

Sistema de Gestión de Incidentes de Seguridad

Versión

1.0 – Preliminar

Estado

En construcción; pendiente de validación con la aplicación definitiva

Público objetivo

Reportantes, técnicos y administradores de empresas y organizaciones

## 1. Introducción
Security Champ es una aplicación web de propósito general diseñada para apoyar a empresas y organizaciones de diferentes sectores en la gestión de incidentes de seguridad informática. La plataforma busca centralizar el registro, clasificación, asignación, seguimiento y cierre de incidentes mediante un sistema de tickets.

La solución facilita la coordinación entre quienes reportan incidentes y los responsables de atenderlos, y permite conservar un historial de los casos y de las acciones documentadas.

### 1.1 Propósito del manual
Orientar a personas sin conocimientos de programación en el uso de Security Champ mediante instrucciones claras y procedimientos sencillos. El documento se actualizará para coincidir con las funcionalidades reales de la versión definitiva.

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

Cuenta y credenciales autorizadas, si se implementa autenticación.

Visualización

Se recomienda una pantalla de computador para facilitar la lectura de formularios y tablas.

Nota: los requisitos definitivos se confirmarán durante las pruebas y al establecer el mecanismo de publicación de la aplicación.

## 3. Acceso al sistema
Cuando la aplicación esté desplegada y se haya confirmado el mecanismo de autenticación, el usuario deberá:

1. Abrir un navegador web compatible.
2. Ingresar al enlace oficial de Security Champ.
3. Esperar a que cargue la pantalla inicial.
4. Ingresar sus credenciales, si el sistema solicita autenticación.
5. Seleccionar la opción para iniciar sesión.
6. Utilizar las opciones habilitadas para su perfil.
[CAPTURA PENDIENTE: pantalla real de acceso o inicio de sesión.]

## 4. Interfaz principal
La interfaz principal será el punto de entrada a los módulos disponibles. La organización final de menús, botones y paneles se documentará después de implementar y validar la interfaz.

- Panel principal o dashboard.
- Gestión y consulta de tickets.
- Registro de incidentes.
- Asignación de responsables.
- Seguimiento y resolución.
- Historial de incidentes.
- Administración de usuarios, si está implementada.
[CAPTURA PENDIENTE: dashboard real con menús y elementos identificados.]

## 5. Perfiles de usuario

### 5.1 Administrador
Perfil encargado de la administración general de la plataforma, de acuerdo con los permisos implementados.

- Gestionar usuarios y permisos, si está habilitado.
- Administrar áreas y especialidades, si está habilitado.
- Consultar y supervisar los incidentes registrados.

### 5.2 Reportante
Persona que informa una situación de seguridad y consulta el avance de sus reportes.

- Registrar nuevos incidentes.
- Consultar sus tickets y el estado correspondiente.
- Ampliar información cuando el proceso lo permita.

### 5.3 Técnico de seguridad
Persona responsable de atender los incidentes que le sean asignados.

- Consultar tickets asignados.
- Registrar avances y observaciones.
- Documentar acciones realizadas y soluciones.
- Actualizar el estado del ticket según sus permisos.
Nota: estos perfiles son la propuesta funcional inicial. Los permisos definitivos deberán coincidir con la implementación.

### 5.4 Analista autorizado
El menú **Diagnóstico** solo aparece para cuentas incluidas por un administrador en `public.analyst_access`. En un proyecto nuevo, ejecuta `supabase.sql`; en una base existente, aplica `supabase_requests_migration.sql`. Después, desde el SQL Editor de Supabase, autoriza cada cuenta usando su UUID de Authentication → Users:

```sql
insert into public.analyst_access (user_id)
values ('UUID-DEL-USUARIO');
```

Los analistas autorizados pueden revisar todos los reportes, clasificar el incidente, registrar el diagnóstico, asignar un responsable y actualizar su estado. Los reportantes pueden consultar, editar los datos descriptivos y eliminar sus propios reportes, pero no pueden cambiar el estado ni el diagnóstico. Los responsables asignables provienen de `public.analysts`; los nombres incluidos en el SQL inicial son ejemplos y deben reemplazarse por el directorio real.

## 6. Funcionalidades del sistema

### 6.1 Registro de incidentes
Permite reportar una situación que pueda afectar la seguridad de la información o la disponibilidad de un servicio.

1. Ingresar a la plataforma.
2. Seleccionar la opción de nuevo incidente.
3. Completar los campos solicitados.
4. Elegir la categoría correspondiente.
5. Describir la situación con claridad.
6. Adjuntar evidencias, si la función está disponible.
7. Confirmar el registro.
[CAPTURA PENDIENTE: formulario real de registro y confirmación del ticket.]

### 6.2 Clasificación de incidentes
Permite organizar los reportes según su naturaleza para facilitar su atención.

- Vulnerabilidades de seguridad.
- Accesos no autorizados.
- Ataques informáticos.
- Caídas o interrupciones de servicios.
- Filtraciones de información.
- Otros incidentes tecnológicos.
[CAPTURA PENDIENTE: categorías disponibles en la aplicación.]

### 6.3 Asignación de tickets
Permite dirigir un incidente al área o responsable que corresponda, de acuerdo con las especialidades configuradas.

1. Abrir el módulo de gestión de tickets.
2. Seleccionar el incidente.
3. Revisar su descripción y clasificación.
4. Elegir el área o responsable disponible.
5. Confirmar la asignación.
[CAPTURA PENDIENTE: pantalla real de asignación.]

### 6.4 Seguimiento de incidentes
Permite consultar el avance de cada caso y registrar actualizaciones.

1. Abrir el ticket que se desea consultar.
2. Revisar el estado y los datos del incidente.
3. Registrar avances u observaciones, si el perfil tiene permiso.
4. Guardar los cambios.
[CAPTURA PENDIENTE: vista de seguimiento y estados reales.]

### 6.5 Solución y cierre
Permite documentar las acciones realizadas y finalizar el ticket cuando se haya completado la atención.

1. Abrir el ticket asignado.
2. Revisar la información del incidente.
3. Registrar las acciones ejecutadas.
4. Documentar la solución aplicada.
5. Actualizar el estado correspondiente.
6. Confirmar el cierre, si el perfil tiene permiso.
[CAPTURA PENDIENTE: registro de solución y cierre.]

### 6.6 Historial de incidentes
Permite consultar los casos registrados y la información conservada de su atención.

1. Ingresar al módulo de historial, si está disponible.
2. Aplicar filtros de búsqueda, si existen.
3. Seleccionar el incidente que se desea consultar.
4. Revisar los datos y las acciones documentadas.
[CAPTURA PENDIENTE: historial real y detalle de un incidente.]

## 7. Ejemplo práctico

### Caso: posible acceso no autorizado
Situación de ejemplo: una persona usuaria detecta actividad sospechosa en una cuenta corporativa y necesita informar el caso al equipo responsable.

1. Ingresar a Security Champ.
2. Crear un nuevo incidente y seleccionar la categoría de acceso no autorizado, si está disponible.
3. Describir qué ocurrió, cuándo se detectó y qué servicio o cuenta podría estar afectado.
4. Adjuntar evidencias permitidas por la aplicación, evitando incluir contraseñas o datos sensibles innecesarios.
5. Enviar el reporte y conservar el identificador del ticket generado.
6. El responsable autorizado revisa y asigna el caso al especialista correspondiente.
7. El técnico documenta las acciones realizadas y actualiza el estado.
8. Al finalizar, registra la solución y cierra el ticket conforme al procedimiento de la organización.
[CAPTURAS PENDIENTES: registro, asignación, seguimiento y cierre del caso.]

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

Esta sección se completará con los errores observados durante las pruebas reales.

## 9. Conclusiones y recomendaciones de uso
Security Champ propone un entorno centralizado para organizar la gestión de incidentes de seguridad informática. Su utilidad depende de que los usuarios registren información clara, mantengan actualizados los tickets y documenten las acciones realizadas.

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

Preliminar

Estructura y contenido inicial elaborados durante el desarrollo.

1.1

Pendiente

Incorporación de pantallas, nombres definitivos de menús y pasos verificados.

Final

Pendiente

Validación completa contra la aplicación desplegada y entrega en PDF.

Importante: los apartados marcados como pendientes son espacios reservados para capturas reales. No representan funcionalidades confirmadas hasta que hayan sido desarrolladas y probadas.

SECURITY CHAMP | Compuestudio | Desarrollo de Software | 2026
