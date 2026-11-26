# Acme School — Plataforma Web de Exámenes

Aplicación web desarrollada en HTML5, CSS3 y JavaScript modular para la gestión administrativa y resolución pública de exámenes en línea de la institución educativa Acme School.

Toda la información de usuarios, exámenes, preguntas y sesiones se gestiona en formato **JSON** utilizando persistencia local mediante localStorage.

---

# Características y Módulos

## 1. Inicio de Sesión (index.html)
* Vista inicial para acceder a los módulos privados de la plataforma.
* Autenticación mediante correo electrónico y contraseña validados contra los registros almacenados en localStorage.
* Enlace directo al módulo público de resolución de exámenes sin necesidad de autenticación.

## 2. Panel Principal (pages/dashboard.html)
* Vista privada de bienvenida que muestra la sesión activa (nombre completo y cargo).
* Acceso rápido a los módulos de gestión de usuarios, gestión de exámenes y vista pública de exámenes.

## 3. Gestión de Usuarios (pages/usuarios.html) — Módulo Privado
* Permite crear, listar, actualizar y eliminar usuarios autorizados para administrar la plataforma.
* Campos gestionados:
  * Número de identificación
  * Nombre completo
  * Email
  * Teléfono
  * Cargo (Administrativo o Docente)
  * Contraseña

## 4. Gestión de Exámenes (pages/gestion-examenes.html) — Módulo Privado
* Permite crear, listar, actualizar y eliminar exámenes.
* Campos gestionados por examen:
  * Código
  * Título
  * Tiempo (minutos asignados para resolver el examen)
  * Porcentaje de aprobación
  * Descripción del examen
* Gestión de preguntas por examen:
  * Creación y eliminación de preguntas asociadas a un examen específico.
  * Múltiples opciones de respuesta por pregunta, garantizando que solo una opción quede marcada como correcta.

## 5. Resolución de Exámenes (`examenes.html`) — Módulo Público
* Acceso abierto para estudiantes sin requerir inicio de sesión.
* Catálogo inicial con los exámenes disponibles (título, tiempo de duración y porcentaje de aprobación).
* Registro de identificación y nombre completo del estudiante antes de iniciar la prueba.
* Encabezado informativo con título, número total de preguntas, porcentaje para aprobar y cronómetro regresivo hasta 00:00.
* Preguntas enumeradas con selección única y botón Terminar para finalizar antes de que se agote el tiempo.
* Pantalla de resultados con el porcentaje de respuestas acertadas y el mensaje de Aprobado o No aprobado según el porcentaje configurado.

