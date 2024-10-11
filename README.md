<p style="text-align: justify;"><b>Universidad de San Carlos de Guatemala</b></p>
<p style="text-align: justify;"><b>LABORATORIO ANALISIS Y DISEñO DE SISTEMAS 2 </b></p>
<p style="text-align: justify;"><b>Seccion A</b></p>
<p style="text-align: justify;"><b>Inga. Claudia Liceth Rojas Morales</b></p>
<p style="text-align: justify;"><b>Aux. Brandon Mauricio Noj Romero</b></p>

| Carnet    |                Nombre                 |
| :-------- | :-----------------------------------: |
| 201903004 | Jonathan Alexander Alvarado Fernández |
| 201404341 |    Ocsael Neftalí Ramírez Castillo    |
| 201314564 |     Ronald Geovany Ordóñez Xiloj      |
| 201345136 |         José Luis Reynoso Tiu         |

# <div align="center">Documentacion Qnave Fase1 </div>

## Antecedentes

La empresa Qnave es una compañía guatemalteca de transporte privado, ha experimentado un crecimiento significativo en la demanda de sus servicios. Inicialmente, la gestión de interacciones entre usuarios y conductores era a través de llamadas telefónicas y manejada únicamente por el administrador, pero enfrentó problemas significativos debido a la pandemia y a la creciente delincuencia organizada en el país. Estos problemas incluyeron asaltos y amenazas que afectaron tanto a conductores como a usuarios, resultando en la pérdida de conductores y en la migración de usuarios hacia competidores con mayores garantías de seguridad.

Para abordar estos desafíos se decidió modernizar la empresa mediante una solución tecnológica que mejore la eficiencia y seguridad del servicio. Se contrató a un programador freelance para desarrollar esta solución, pero la falta de claridad en la documentación presentó dudas sobre la viabilidad y sostenibilidad del proyecto. El objetivo es optimizar los costos operativos y posicionar a Qnave como líder en el mercado de transporte privado en Guatemala.

Problemas Identificados:

- La demanda de servicios ha crecido significativamente.
- El administrador no puede gestionar todas las solicitudes y problemas debido a la alta carga de trabajo.
- Es necesario dividir las responsabilidades entre diferentes roles para mantener la calidad del servicio y la eficiencia operativa.

## Core del Negocio

El core del negocio de Qnave es ofrecer un servicio de transporte privado seguro y eficiente en Guatemala. La empresa busca mejorar la experiencia de los usuarios y conductores mediante una plataforma tecnológica que gestione la coordinación de viajes, la seguridad, y la comunicación entre los diferentes actores del servicio. La plataforma de Qnave ofrece un servicio de transporte privado donde los usuarios pueden solicitar viajes a través de una aplicación móvil. Los conductores aceptan las solicitudes y proporcionan el transporte. La plataforma facilita el proceso de solicitud de viajes, la gestión de conductores y usuarios, y proporciona mecanismos para calificar y reportar problemas. La inclusión de roles adicionales como asistentes y administradores permite una gestión más efectiva y un control de calidad del servicio.
Funcionalidades Clave:

- Usuarios: Pueden solicitar viajes, pagar, calificar conductores, y reportar problemas.
- Conductores: Aceptan y completan viajes, reportan problemas, y revisan información de los usuarios.
- Asistentes: Manejan solicitudes de empleo de conductores, actualizan información, y generan reportes.
- Administradores: Generan reportes, gestionan calificaciones, estadísticas, y controlan las altas y bajas de asistentes.

## Diagrama de CDU de Alto Nivel

![Diagrama Caso Alto Nivel](/imagenes/DiagramaAltoNivel.png)

### Casos de Uso

![Diagrama Caso de Uso 1](/imagenes/caso1.png)
![Diagrama Caso de Uso 2](/imagenes/caso2.png)
![Diagrama Caso de Uso 3](/imagenes/caso3.PNG)
![Diagrama Caso de Uso 4](/imagenes/caso4.PNG)
![Diagrama Caso de Uso 5](/imagenes/caso5.PNG)
![Diagrama Caso de Uso 6](/imagenes/caso6.PNG)
![Diagrama Caso de Uso 7](/imagenes/caso7.PNG)
![Diagrama Caso de Uso 8](/imagenes/caso8.PNG)
![Diagrama Caso de Uso 9](/imagenes/caso9.PNG)
![Diagrama Caso de Uso 10](/imagenes/caso10.PNG)
![Diagrama Caso de Uso 11](/imagenes/caso11.PNG)
![Diagrama Caso de Uso 12](/imagenes/caso12.PNG)
![Diagrama Caso de Uso 13](/imagenes/caso13.PNG)
![Diagrama Caso de Uso 14](/imagenes/caso14.PNG)
![Diagrama Caso de Uso 15](/imagenes/caso15.PNG)
![Diagrama Caso de Uso 16](/imagenes/caso16.PNG)
![Diagrama Caso de Uso 17](/imagenes/caso17.PNG)
![Diagrama Caso de Uso 18](/imagenes/caso18.PNG)
![Diagrama Caso de Uso 19](/imagenes/caso19.PNG)
![Diagrama Caso de Uso 20](/imagenes/caso20.PNG)
![Diagrama Caso de Uso 21](/imagenes/caso21.PNG)
![Diagrama Caso de Uso 22](/imagenes/caso22.PNG)

## Primera Descomposición del Diagrama

### Usuario:

- Registro: Validación de datos, confirmación por correo electrónico.
- Solicitar Viaje: Definir punto de partida y destino,pago.
- Pagar: Opciones de pago en efectivo o tarjeta.
- Calificar: Sistema de estrellas para calificar al conductor.
- Reportar Problema: Descripción del problema y detalles.
- Modificar Info: Cambios en datos personales o tarjeta de crédito.
- Ver Info Conductor: Detalles del conductor asignado.

### Conductor:

- Registro: Verificación de documentos, información del vehículo.
- Aceptar Viaje: Confirmar la aceptación de una solicitud de viaje.
- Cancelar Viaje: Cancelación de un viaje aceptado con motivo.
- Modificar Info: Actualización de datos personales o del vehículo.
- Reportar Problema: Reporte de problemas durante el servicio.
- Calificar Usuario: Sistema de estrellas para calificar al usuario.
- Ver Info Usuario: Información del usuario antes de aceptar un viaje.
- Finalizar Viaje: Marcar el viaje como completado.
- Resumen Ganancias: Ver ganancias diarias y acumuladas.

### Asistente:

- Revisar Solicitudes: Evaluar y aprobar solicitudes de empleo de conductores.
- Ver Info Conductores: Detalles y estadísticas de los conductores.
- Dar de Baja Conductores: Desactivación de cuentas de conductores.
- Ver Info Usuarios: Información general y estadísticas de los usuarios.
- Dar de Baja Usuarios: Desactivación de cuentas de usuarios.
- Generar Ofertas: Crear y gestionar ofertas especiales para usuarios.
- Revisar Cambios Info: Aprobación de cambios en la información de los conductores.
- Reportes Vehículos: Generación de reportes detallados de los vehículos.

### Administrador:

- Generar Reportes: Reportes de rendimiento y operativos de la plataforma.
- Ver Calificaciones: Evaluar calificaciones de usuarios y conductores.
- Estadísticas Registro: Gráficos de registro de usuarios, conductores y asistentes.
- Estadísticas Uso: Gráficos de uso de la plataforma.
- Reporte de Ganancias: Informe de ingresos de la plataforma.
- Contratar Asistentes: Proceso de contratación y configuración de asistentes.
- Dar de Baja Asistentes: Desactivación de cuentas de asistentes y reasignación de tareas.

### Lista de Requerimientos Funcionales Generales
#### Funcionales
1. Funciones de usuarios
* Usuario
  * Registrar
  * Iniciar sesión
  * Solicitar viaje
  * Cancelar viaje
  * Ver información del conductor
  * Reportar
  * Calificar conductor
  * Actualizar datos
  * Seleccionar metodo de pago
* Conductor
  * Registrar
  * Iniciar sesión
  * Aceptar viaje
  * Cancelar viaje
  * Ver información del usuario
  * Reportar
  * Calificar usuario
  * Marcar como finalizado el viaje
* Asistente
  * Iniciar sesión
  * Aceptar solicitud de empleo
  * Ver información de un usuario
  * Ver información de un conductor
  * Dar de baja a un usuario
  * Dar de baja a un conductor
  * Ver información de los vehiculos
  * Ver comentarios
  * Ver calificaciones
  * Aprobar cambios de información
* Administrador
  * Iniciar sesión
  * Generar reportes
  * Ver estadísticas de registros
  * Registrar asistentes
  * Dar de baja a un asistente
2. Seguridad
  * Validacion de registros por medio de correo
  * Generacion de contraseñas temporales
  * Prevención de accesos no autorizados

#### No funcionales
1. Escalabilidad: El sistema debe ser capaz de manejar el aumento de usuarios que hacen uso de la aplicación; así como sus diferentes transacciones (solicitudes de viaje, pagos, administración de usuarios, etc.)
2. Disponibilidad: El sistema debe estar disponible en todo momento devido a que los usuarios tienen que tener acceso al sistema en el momento que lo necesite.
3. Seguridad: Cifrar los datos sensibles
4. Rendimiento: El tiempo de respuesta debe ser rápido para que los usuarios de la aplicacion tengan una buena experiencia
5. Mantenimiento: Debe seguir buenas practicas de desarrollo como lo es un buen manejo del control de versiones, una buena normalización de base de datos, etc.
6. Despliegue: Este debe ser desplegado en la nube, utilizando docker para garantizar la consistencia y portabilidad del proyecto desarrollado en un entorno productivo.

## Diagramas de Casos de Uso Expandidos

![Diagrama Caso de Uso 1](/imagenes/caso1-1.png)
![Diagrama Caso de Uso 2](/imagenes/caso2-1.png)
![Diagrama Caso de Uso 3](/imagenes/caso3-1.png)
![Diagrama Caso de Uso 4](/imagenes/caso4-1.png)
![Diagrama Caso de Uso 5](/imagenes/caso5-1.png)
![Diagrama Caso de Uso 6](/imagenes/caso6-1.png)
![Diagrama Caso de Uso 7](/imagenes/caso7-1.png)
![Diagrama Caso de Uso 8](/imagenes/caso8-1.png)
![Diagrama Caso de Uso 9](/imagenes/caso9-1.png)
![Diagrama Caso de Uso 10](/imagenes/caso10-1.png)
![Diagrama Caso de Uso 11](/imagenes/caso11-1.png)
![Diagrama Caso de Uso 12](/imagenes/caso12-1.png)
![Diagrama Caso de Uso 13](/imagenes/caso13-1.png)
![Diagrama Caso de Uso 14](/imagenes/caso14-1.png)
![Diagrama Caso de Uso 15](/imagenes/caso15-1.png)
![Diagrama Caso de Uso 16](/imagenes/caso16-1.png)
![Diagrama Caso de Uso 17](/imagenes/caso17-1.png)
![Diagrama Caso de Uso 18](/imagenes/caso18-1.png)
![Diagrama Caso de Uso 19](/imagenes/caso19-1.png)
![Diagrama Caso de Uso 20](/imagenes/caso20-1.png)
![Diagrama Caso de Uso 21](/imagenes/caso21-1.png)
![Diagrama Caso de Uso 22](/imagenes/caso22-1.png)

## Matrices de Trazabilidad

### Stakeholders vs Requerimientos

![Stakeholders vs Requerimientos](/imagenes/stkvsreq.png)

### Stakeholders vs Casos de uso

![Stakeholders vs CDU1](/imagenes/stkvscdu1.png)
![Stakeholders vs CDU2](/imagenes/stkvscdu2.png)

### Requerimientos vs Casos de uso

![Requerimientos vs CDU1](/imagenes/reqvscdu1.png)
![Requerimientos vs CDU2](/imagenes/reqvscdu2.png)

## Diagrama de Despliegue

![Diagrama de despliegue de la arquitectura](/imagenes/diagramaDespliegue.png)

## Diagrama de implementacion

![Diagrama de implementacion de la arquitectura](/diagramas/implementacion.png)

**Patrones de diseño propuestos**

1. **Patrón Singleton**

**Descripción:** El patrón Singleton asegura que una clase tenga solo una instancia y proporciona un punto de acceso global a esa instancia. Esto es útil para gestionar recursos compartidos, como configuraciones globales.

- **Ventajas:**
  - **Control Centralizado:** Garantiza un único punto de acceso para configuraciones o recursos globales, evitando inconsistencias.
  - **Uso Eficiente de Recursos:** Minimiza el uso de memoria al asegurar que solo exista una instancia.
- **Utilidad en el Proyecto:** Se puede utilizar el patrón Singleton para la configuración global de la plataforma, como la autenticación del administrador y la gestión de reportes, asegurando que solo haya una instancia que controle estas operaciones críticas.

2. **Patrón Factory Method**

**Descripción:** El patrón Factory Method define una interfaz para crear objetos, pero permite a las subclases decidir qué clase instanciar. Es útil cuando el tipo de objeto a crear no se conoce hasta el momento de ejecución.

- **Ventajas:**
  - **Flexibilidad:** Permite la creación de objetos sin especificar la clase exacta, facilitando la adición de nuevos tipos de usuarios o roles.
  - **Desacoplamiento:** Reduce el acoplamiento entre el código cliente y las clases concretas que se crean.
- **Utilidad en el Proyecto:** Se puede usar este patrón para crear diferentes tipos de usuarios (Usuario, Conductor, Asistente) sin que el código de la aplicación tenga que conocer las clases específicas que se instancian.

3. **Patrón Observer**

**Descripción:** El patrón Observer define una dependencia uno a muchos entre objetos, de manera que cuando un objeto cambia de estado, todos sus dependientes son notificados y actualizados automáticamente.

- **Ventajas:**
  - **Desacoplamiento:** Permite que el sujeto y los observadores estén desacoplados, facilitando la expansión y mantenimiento del sistema.
  - **Notificaciones Automáticas:** Proporciona un mecanismo eficiente para notificar a múltiples objetos sobre cambios en el estado.
- **Utilidad en el Proyecto:** Se puede utilizar el patrón Observer para notificar a los conductores sobre nuevas solicitudes de viaje, asegurando que solo un conductor acepte cada viaje y evitando conflictos.

4. **Patrón Strategy**

**Descripción:** El patrón Strategy define una familia de algoritmos, encapsula cada uno y los hace intercambiables. Permite que el algoritmo varie independientemente de los clientes que lo utilizan.

- **Ventajas:**
  - **Intercambiabilidad de Algoritmos:** Permite cambiar el comportamiento del sistema de forma dinámica.
  - **Separación de Responsabilidades:** Facilita la modificación o adición de nuevos algoritmos sin alterar el código cliente.
- **Utilidad en el Proyecto:** Este patrón es útil para calcular tarifas de viaje basadas en zonas, permitiendo la adición o modificación de estrategias de cálculo sin cambiar el código del sistema principal.

5. **Patrón Command**

**Descripción:** El patrón Command encapsula una solicitud como un objeto, así que puedes parametrizar los objetos con diferentes solicitudes, colas o registros de solicitudes, y deshacer operaciones.

- **Ventajas:**
  - **Desacoplamiento de Solicitudes:** Separa el objeto que invoca la operación del que sabe cómo realizarla.
  - **Deshacer y Rehacer:** Permite implementar operaciones de deshacer y rehacer fácilmente.
- **Utilidad en el Proyecto:** puede ser útil para manejar operaciones como aceptar y cancelar viajes, permitiendo una gestión flexible de estos comandos y facilitando la implementación de características adicionales como deshacer una acción.

6. **Patrón Decorator**

**Descripción:** El patrón Decorator permite añadir responsabilidades adicionales a un objeto de forma dinámica. Proporciona una alternativa flexible a la sub-clasificación para extender la funcionalidad de los objetos.

- **Ventajas:**
  - **Extensibilidad:** Permite añadir funcionalidades a los objetos de forma dinámica sin modificar su código.
  - **Flexibilidad:** Los objetos pueden ser decorados con múltiples funcionalidades de manera combinada.
- **Utilidad en el Proyecto:** se puede aplicar el patrón Decorator para añadir funcionalidades adicionales a los usuarios y conductores, como reportar problemas o agregar calificaciones, sin alterar las clases originales.

**Patrones de diseño propuestos**

# Estilo arquitectonico propuesto (En capas)
1. Capa de presentación

Esta capa interactúa directamente con los usuarios, conductores, asistentes y administradores. Es responsable de la interfaz de usuario y se encarga de recibir las solicitudes de los usuarios y mostrar la información de respuesta proporcionada por las capas inferiores.

2. Capa de lógica de negocios

Contiene las reglas de negocio y la lógica que define cómo se manejan las operaciones del sistema. Esta capa gestiona las interacciones entre usuarios, conductores, viajes, pagos, y más.

Se ocupa de las funcionalidades como el registro, la autenticación de usuarios, la gestión de viajes, la asignación de conductores, la calificación de usuarios/conductores, y la gestión de pagos. Aquí se puede implementar la validación de datos, los cálculos relacionados con tarifas de viajes, asignación de rutas, entre otras.

2. Capa de acceso a datos

Esta capa es responsable de la comunicación con la base de datos. Aquí se realizan las operaciones CRUD sobre las bases de datos de la aplicación. Esta capa se conecta a la base de datos para almacenar y recuperar información de usuarios, conductores, viajes, pagos y reportes.

3. Capa de base de datos

Contiene la base de datos donde se almacena toda la información de la aplicación. Esta capa no interactúa directamente con los usuarios, solo a través de la capa de acceso a datos.

4. Capa de servicios

A veces, se agrega una capa intermedia para gestionar la lógica que conecta las aplicaciones internas con servicios externos. Esta capa sería responsable de la integración con servicios externos, como sistemas de pago, notificaciones por SMS o correo, servicios de geolocalización, entre otros.

### ¿Por qué elegir la arquitectura por capas?
1. Claridad: Cada capa tiene una responsabilidad clara, lo que hace que el sistema sea más fácil de entender, mantener y escalar. El código se organiza de manera lógica, lo que facilita futuras actualizaciones.

2. Separación de funciones: Los cambios en una capa no afectan directamente a las otras capas, lo que reduce el riesgo de errores y hace que el desarrollo sea más eficiente.

3. Reutilización de código: Las reglas de negocio y la lógica de acceso a datos se pueden reutilizar en diferentes partes de la aplicación.

4. Facilidad de testing: Cada capa puede ser probada por separado, lo que facilita la identificación de errores y la mejora de la calidad del software, por lo que esto aumenta las probabilidades de una aplicación segura.

5. Escalabilidad: Aunque una arquitectura por capas no es tan escalable como los microservicios, es posible escalar de manera eficiente al dividir las capas de manera horizontal. Por ejemplo, se podría escalar la capa de lógica de negocio si la demanda de procesamiento de viajes aumenta.


![Estilo en capas](/diagramas/estiloarqui.png)

# Diagrama de componentes

![Componentes](/diagramas/componentes.png)

# Diagrama entidad relación

![ER](/diagramas/er.png)

## Actualización usuario

![ACTUALIZACIÓN](/prototypes/user/ACTUALIZACION.png)

## Calificación usuario

![CALIFICACIÓN](/prototypes/user/CALIFICACION.png)

## Cancelar viaje

![CANCELAR VIAJE](/prototypes/user/CANCELAR-VIAJE.png)

## Inicio de sesión

![INICIO DE SESIÓN](/prototypes/user/INICIO-SESION.png)

## Pago

![PAGO](/prototypes/user/PAGO.png)

## Pedir viaje

![PEDIR VIAJE](/prototypes/user/PEDIR-VIAJE.png)

## Registro

![REGISTRO](/prototypes/user/REGISTRO.png)

## Reportar

![REPORTAR](/prototypes/user/REPORTAR.png)

## Ver información

![VER INFORMACIÓN](/prototypes/user/VER-INFORMACION.png)

**Tablero**

[Link tablero](https://trello.com/b/6k8pi63h/ayd2-proyecto1)

## Captura 1

![TABLERO 1](/imagenes/tablero1.png)

## Captura 2

![TABLERO 2](/imagenes/tablero2.png)

## Captura 3

![TABLERO 3](/imagenes/tablero3.png)

## Captura 4

![TABLERO 4](/imagenes/tablero4.png)
