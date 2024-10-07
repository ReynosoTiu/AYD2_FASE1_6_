-- Tabla para almacenar la información común de todos los usuarios (conductores, asistentes, administrador)
CREATE TABLE Usuarios (
    UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(255) NOT NULL,
    Telefono NVARCHAR(20),
    Edad INT,
    DPI NVARCHAR(15) UNIQUE NOT NULL,
    CorreoElectronico NVARCHAR(255) UNIQUE NOT NULL,
    Contrasena NVARCHAR(255) NOT NULL,  -- Almacena contraseñas encriptadas
    Direccion NVARCHAR(255),
    Genero NVARCHAR(10),
    EstadoCivil NVARCHAR(50),
    FechaRegistro DATETIME DEFAULT GETDATE(),
    TipoUsuario NVARCHAR(50) NOT NULL,  -- 'Conductor', 'Asistente', 'Administrador'
    CodigoEmpleado NVARCHAR(20),  -- Para conductores y asistentes
    ContrasenaTemporal BIT DEFAULT 1,  -- Indicador de contraseña temporal
    Activo BIT DEFAULT 1
);

-- Tabla para almacenar información de conductores
CREATE TABLE Conductores (
    ConductorID INT PRIMARY KEY FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    Fotografia NVARCHAR(MAX),  -- Ruta a la imagen
    FotografiaVehiculo NVARCHAR(MAX),  -- Ruta a la imagen del vehículo
    NumeroPlaca NVARCHAR(10) UNIQUE NOT NULL,
    MarcaVehiculo NVARCHAR(50),
    AnioVehiculo INT,
    CV NVARCHAR(MAX),  -- Ruta al archivo PDF del CV
    Estatus NVARCHAR(20) DEFAULT 'Inactivo',  -- 'Activo', 'Suspendido', 'Inactivo','Rechazado'
    Calificacion DECIMAL(3,2) DEFAULT 0,
    NumeroViajes INT DEFAULT 0
);

-- Tabla para almacenar información de asistentes
CREATE TABLE Asistentes (
    AsistenteID INT PRIMARY KEY FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    NumeroCuenta NVARCHAR(20),
    CV NVARCHAR(MAX),  -- Ruta al archivo PDF del CV
    Estatus NVARCHAR(20) DEFAULT 'Activo'
);

-- Tabla para almacenar información de viajes
CREATE TABLE Viajes (
    ViajeID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    ConductorID INT FOREIGN KEY REFERENCES Conductores(ConductorID),
    ZonaInicio NVARCHAR(50),
    ZonaFin NVARCHAR(50),
    FechaHoraInicio DATETIME NOT NULL,
    FechaHoraFin DATETIME,
    Tarifa DECIMAL(10,2),
    Estado NVARCHAR(20) DEFAULT 'Pendiente',  -- 'Pendiente', 'Aceptado', 'Finalizado', 'Cancelado'
    PagoRecibido BIT DEFAULT 0
);

-- Tabla para registrar los reportes de problemas
CREATE TABLE ReportesProblemas (
    ReporteID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    ViajeID INT FOREIGN KEY REFERENCES Viajes(ViajeID),
    Categoria NVARCHAR(50),
    Descripcion NVARCHAR(255),
    FechaReporte DATETIME DEFAULT GETDATE(),
    Evidencia NVARCHAR(MAX)  -- Ruta a archivos adjuntos
);

-- Tabla para registrar cancelaciones de viajes
CREATE TABLE Cancelaciones (
    CancelacionID INT IDENTITY(1,1) PRIMARY KEY,
    ConductorID INT FOREIGN KEY REFERENCES Conductores(ConductorID),
    ViajeID INT FOREIGN KEY REFERENCES Viajes(ViajeID),
    Motivo NVARCHAR(255),
    FechaCancelacion DATETIME DEFAULT GETDATE(),
    Justificacion NVARCHAR(MAX)  -- Para cuando un conductor excede el límite de cancelaciones
);

-- Tabla para almacenar información adicional de usuarios (utilizada por conductores para ver info de usuarios)
CREATE TABLE InformacionUsuarios (
    UsuarioID INT PRIMARY KEY FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    Calificacion DECIMAL(3,2) DEFAULT 0,
    NumeroViajes INT DEFAULT 0,
    Comentarios NVARCHAR(MAX)
);

-- Tabla para almacenar la información del administrador
CREATE TABLE Administradores (
    AdministradorID INT PRIMARY KEY FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    ClaveArchivo NVARCHAR(255) NOT NULL  -- Clave de seguridad encriptada que viene en el archivo .ayd
);

-- Tabla para registrar cambios de contraseñas y recuperación
CREATE TABLE RecuperacionContrasena (
    RecuperacionID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    TokenRecuperacion NVARCHAR(255),  -- Token para recuperación de contraseña
    FechaSolicitud DATETIME DEFAULT GETDATE(),
    FechaExpiracion DATETIME
);

-- Tabla para registrar confirmaciones de registro de usuarios
CREATE TABLE ConfirmacionesRegistro (
    ConfirmacionID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    CorreoConfirmado BIT DEFAULT 0,
    FechaEnvioCorreo DATETIME DEFAULT GETDATE()
);


-- Tabla para registrar la baja de conductores
CREATE TABLE BajasConductores (
    BajaID INT IDENTITY(1,1) PRIMARY KEY,
    ConductorID INT FOREIGN KEY REFERENCES Conductores(ConductorID),
    Motivo NVARCHAR(255) NOT NULL,
    FechaBaja DATETIME DEFAULT GETDATE(),
    BajaPor NVARCHAR(255) NOT NULL  -- Nombre del asistente que dio de baja al conductor
);


CREATE TABLE BajasUsuarios (
    BajaID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    Motivo NVARCHAR(255) NOT NULL,
    FechaBaja DATETIME DEFAULT GETDATE(),
    BajaPor NVARCHAR(255) NOT NULL
);
