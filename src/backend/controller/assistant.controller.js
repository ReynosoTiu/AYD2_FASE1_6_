import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const registerAsistente = async (req, res) => {
    const {
        NombreCompleto,
        Telefono,
        Edad,
        DPI,
        CorreoElectronico,
        CV,  // PDF en base64
        Fotografia,  // Imagen del asistente en base64
        NumeroCuenta,
        Direccion,
        Genero,
        EstadoCivil
    } = req.body;

    // Validar la entrada
    if (!NombreCompleto || !Telefono || !Edad || !DPI || !CorreoElectronico || !CV || !Fotografia || !NumeroCuenta || !Direccion || !Genero || !EstadoCivil) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const pool = await getConnection();

        // Verificar si el DPI o correo ya existen
        const existingUser = await pool
            .request()
            .input("DPI", sql.VarChar, DPI)
            .input("CorreoElectronico", sql.VarChar, CorreoElectronico)
            .query(`
                SELECT COUNT(*) AS Count 
                FROM Usuarios 
                WHERE DPI = @DPI OR CorreoElectronico = @CorreoElectronico;
            `);

        if (existingUser.recordset[0].Count > 0) {
            return res.status(400).json({ error: 'El DPI o el correo electrónico ya están registrados' });
        }

        // Generar código de empleado y contraseña temporal
        const CodigoEmpleado = `EMP-${uuidv4().slice(0, 8).toUpperCase()}`;
        const ContrasenaTemporal = uuidv4().slice(0, 8);
        const hashedPassword = await bcrypt.hash(ContrasenaTemporal, 10);

        // Crear la carpeta 'uploads' si no existe
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Guardar el archivo PDF (CV) en la carpeta 'cvUploads'
        const base64PdfData = CV.replace(/^data:application\/pdf;base64,/, '');
        const cvFilename = `${uuidv4()}_CV.pdf`;
        const cvFilePath = path.join(uploadDir, 'cvUploads', cvFilename);
        if (!fs.existsSync(path.join(uploadDir, 'cvUploads'))) {
            fs.mkdirSync(path.join(uploadDir, 'cvUploads'));
        }
        fs.writeFileSync(cvFilePath, base64PdfData, 'base64');

        // Guardar la imagen (fotografía del asistente)
        const base64ImageData = Fotografia.replace(/^data:image\/\w+;base64,/, '');
        const imageFilename = `${uuidv4()}_profile.png`;
        const imageFilePath = path.join(uploadDir, 'profileImages', imageFilename);
        if (!fs.existsSync(path.join(uploadDir, 'profileImages'))) {
            fs.mkdirSync(path.join(uploadDir, 'profileImages'));
        }
        fs.writeFileSync(imageFilePath, base64ImageData, 'base64');

        // Insertar datos en la tabla Usuarios
        const usuarioResult = await pool.request()
            .input("NombreCompleto", sql.VarChar, NombreCompleto)
            .input("Telefono", sql.VarChar, Telefono)
            .input("Edad", sql.Int, Edad)
            .input("DPI", sql.VarChar, DPI)
            .input("CorreoElectronico", sql.VarChar, CorreoElectronico)
            .input("Contrasena", sql.VarChar, hashedPassword)
            .input("Direccion", sql.VarChar, Direccion)
            .input("Genero", sql.VarChar, Genero)
            .input("EstadoCivil", sql.VarChar, EstadoCivil)
            .input("CodigoEmpleado", sql.VarChar, CodigoEmpleado)
            .input("ContrasenaTemporal", sql.Bit, 1)  // La contraseña es temporal
            .query(`
                INSERT INTO Usuarios (NombreCompleto, Telefono, Edad, DPI, CorreoElectronico, Contrasena, Direccion, Genero, EstadoCivil, TipoUsuario, CodigoEmpleado, ContrasenaTemporal)
                OUTPUT INSERTED.UsuarioID
                VALUES (@NombreCompleto, @Telefono, @Edad, @DPI, @CorreoElectronico, @Contrasena, @Direccion, @Genero, @EstadoCivil, 'Asistente', @CodigoEmpleado, 1);
            `);

        const AsistenteID = usuarioResult.recordset[0].UsuarioID;

        // Insertar datos en la tabla Asistentes
        await pool.request()
            .input("AsistenteID", sql.Int, AsistenteID)
            .input("NumeroCuenta", sql.VarChar, NumeroCuenta)
            .input("CV", sql.VarChar, cvFilename)  // Ruta del CV
            .query(`
                INSERT INTO Asistentes (AsistenteID, NumeroCuenta, CV)
                VALUES (@AsistenteID, @NumeroCuenta, @CV);
            `);

        // Enviar correo con la contraseña temporal (puedes integrar un servicio de correo aquí)

        res.status(201).json({
            message: 'Asistente registrado con éxito',
            CodigoEmpleado,
            ContrasenaTemporal
        });

    } catch (error) {
        console.error('Error al registrar el asistente:', error);
        res.status(500).json({ error: 'Error al registrar el asistente' });
    }
};

export const listarConductoresInactivos = async (req, res) => {
    try {
        const pool = await getConnection();

        // Realizar la consulta para obtener los conductores con estatus 'Inactivo' y 'Pendiente'
        const conductoresPendientesYInactivos = await pool.request()
            .query(`
                SELECT 
                    U.UsuarioID,
                    U.NombreCompleto,
                    U.Telefono,
                    U.CorreoElectronico,
                    C.Estatus  -- Para verificar el estado del conductor
                FROM Conductores C
                INNER JOIN Usuarios U ON C.ConductorID = U.UsuarioID
                WHERE C.Estatus IN ('Inactivo', 'Pendiente');  -- Incluye ambos estatus
            `);

        if (conductoresPendientesYInactivos.recordset.length === 0) {
            return res.status(404).json({ message: 'No hay conductores pendientes o inactivos por aprobar.' });
        }

        // Retornar la lista de conductores con datos generales
        res.status(200).json(conductoresPendientesYInactivos.recordset);
    } catch (error) {
        console.error('Error al obtener los conductores pendientes o inactivos:', error);
        res.status(500).json({ error: 'Error al obtener los conductores pendientes o inactivos' });
    }
};


//TODO: OBTENER IMAGENES
export const obtenerConductorInactivoPorID = async (req, res) => {
    const { id } = req.params;  // Recibir el ID desde los parámetros de la URL

    try {
        const pool = await getConnection();

        // Realizar la consulta para obtener los detalles del conductor por ID, sin importar el estatus
        const conductor = await pool.request()
            .input("ConductorID", sql.Int, id)
            .query(`
                SELECT 
                    U.UsuarioID,
                    U.NombreCompleto,
                    U.Telefono,
                    U.Edad,
                    U.DPI,
                    U.CorreoElectronico,
                    U.Direccion,
                    U.Genero,
                    U.EstadoCivil,
                    C.Fotografia,
                    C.FotografiaVehiculo,
                    C.NumeroPlaca,
                    C.MarcaVehiculo,
                    C.AnioVehiculo,
                    C.CV,
                    C.Estatus  -- Para verificar el estado del conductor
                FROM Conductores C
                INNER JOIN Usuarios U ON C.ConductorID = U.UsuarioID
                WHERE C.ConductorID = @ConductorID;
            `);

        if (!conductor.recordset[0]) {
            return res.status(404).json({ message: 'Conductor no encontrado o ya activado.' });
        }

        const data = conductor.recordset[0];

        // Rutas de las imágenes y el CV en el sistema de archivos
        const uploadDir = path.join(__dirname, '../uploads');
        const cvFilePath = path.join(uploadDir, 'cvUploads', data.CV);
        const imageFilePath = path.join(uploadDir, 'profileImages', data.Fotografia);
        const vehicleImageFilePath = path.join(uploadDir, 'vehicleImages', data.FotografiaVehiculo);

        // Leer y convertir los archivos a base64
        const cvBase64 = fs.existsSync(cvFilePath)
            ? `data:application/pdf;base64,${fs.readFileSync(cvFilePath, 'base64')}`
            : null;

        const profileImageBase64 = fs.existsSync(imageFilePath)
            ? `data:image/png;base64,${fs.readFileSync(imageFilePath, 'base64')}`
            : null;

        const vehicleImageBase64 = fs.existsSync(vehicleImageFilePath)
            ? `data:image/png;base64,${fs.readFileSync(vehicleImageFilePath, 'base64')}`
            : null;

        // Retornar los detalles del conductor con los archivos en base64
        res.status(200).json({
            ...data,
            CV: data.CV,
            Fotografia: profileImageBase64,  // Enviar imagen en base64
            FotografiaVehiculo: vehicleImageBase64  // Enviar imagen de vehículo en base64
        });
    } catch (error) {
        console.error('Error al obtener el conductor:', error);
        res.status(500).json({ error: 'Error al obtener el conductor' });
    }
};


export const obtenerConductoresBasicos = async (req, res) => {
    try {
        const pool = await getConnection();

        // Realizar la consulta para obtener los datos básicos de todos los conductores
        const conductores = await pool.request()
            .query(`
                SELECT 
                    U.UsuarioID,
                    U.NombreCompleto,
                    U.Telefono,
                    U.CorreoElectronico,
                    C.NumeroPlaca                   
                FROM Conductores C
                INNER JOIN Usuarios U ON C.ConductorID = U.UsuarioID;
            `);

        if (conductores.recordset.length === 0) {
            return res.status(404).json({ message: 'No hay conductores registrados.' });
        }

        // Retornar la lista de conductores con sus datos básicos
        res.status(200).json(conductores.recordset);
    } catch (error) {
        console.error('Error al obtener los conductores:', error);
        res.status(500).json({ error: 'Error al obtener los conductores' });
    }
};

//TODO: OBTENER IMAGENES
export const obtenerConductorDetallesPorID = async (req, res) => {
    const { id } = req.params;  // Recibir el ID desde los parámetros de la URL

    try {
        const pool = await getConnection();
  //      (SELECT COUNT(*) FROM Viajes V WHERE V.ConductorID = C.ConductorID) AS TotalViajes,                   
    //    (SELECT STRING_AGG(Comentario, '; ') FROM Comentarios WHERE ConductorID = C.ConductorID) AS Comentarios
  
        // (SELECT AVG(Calificacion) FROM Calificaciones WHERE ConductorID = C.ConductorID) AS PromedioCalificacion,
        // Realizar la consulta para obtener los detalles completos del conductor por ID
        const conductorDetalles = await pool.request()
            .input("ConductorID", sql.Int, id)
            .query(`
                SELECT 
                    U.UsuarioID,
                    U.NombreCompleto,
                    U.Telefono,
                    U.Edad,
                    U.DPI,
                    U.CorreoElectronico,
                    U.Direccion,
                    U.Genero,
                    U.EstadoCivil,
                    C.NumeroPlaca,
                    C.MarcaVehiculo,
                    C.AnioVehiculo,
                    C.Fotografia,
                    C.FotografiaVehiculo,
                    C.CV,
                    C.Estatus AS EstadoCuenta
                    FROM Conductores C
                INNER JOIN Usuarios U ON C.ConductorID = U.UsuarioID
                WHERE C.ConductorID = @ConductorID;
            `);

        if (!conductorDetalles.recordset[0]) {
            return res.status(404).json({ message: 'Conductor no encontrado.' });
        }

        // Extraer datos del conductor
        const conductor = conductorDetalles.recordset[0];

        // Definir rutas de los archivos
        const uploadDir = path.join(__dirname, '../uploads');
        const cvFilePath = path.join(uploadDir, 'cvUploads', conductor.CV);
        const profileImagePath = path.join(uploadDir, 'profileImages', conductor.Fotografia);
        const vehicleImagePath = path.join(uploadDir, 'vehicleImages', conductor.FotografiaVehiculo);

        // Leer el archivo CV y convertirlo a base64
        const cvBase64 = fs.existsSync(cvFilePath) ? fs.readFileSync(cvFilePath, 'base64') : null;

        // Leer la imagen de perfil y convertirla a base64
        const profileImageBase64 = fs.existsSync(profileImagePath) ? fs.readFileSync(profileImagePath, 'base64') : null;

        // Leer la imagen del vehículo y convertirla a base64
        const vehicleImageBase64 = fs.existsSync(vehicleImagePath) ? fs.readFileSync(vehicleImagePath, 'base64') : null;

        // Retornar los detalles completos del conductor, incluyendo archivos en base64
        res.status(200).json({
            ...conductor,
            CV: conductor.CV,
            Fotografia: conductor.Fotografia,
            FotografiaVehiculo: conductor.FotografiaVehiculo
        });

    } catch (error) {
        console.error('Error al obtener los detalles del conductor:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del conductor' });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();

        const resultado = await pool.request().query(`
            SELECT 
                UsuarioID,
                NombreCompleto,
                CorreoElectronico,
                Telefono,
                TipoUsuario,
                Activo
            FROM Usuarios
            WHERE TipoUsuario NOT IN ('Conductor', 'Asistente');
        `);

        res.status(200).json(resultado.recordset);
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        res.status(500).json({ error: "Error al obtener la lista de usuarios" });
    }
};

//TODO: OBTENER IMAGENES
export const obtenerDetalleUsuario = async (req, res) => {
    const { id } = req.params; // ID del usuario a buscar

    try {
        const pool = await getConnection();

        const resultado = await pool.request()
            .input("UsuarioID", sql.Int, id)
            .query(`
                SELECT 
                    u.UsuarioID,
                    u.NombreCompleto,
                    u.CorreoElectronico,
                    u.Telefono,
                    u.DPI,
                    u.Direccion,
                    u.Genero,
                    u.EstadoCivil,
                    u.FechaRegistro,
                    u.TipoUsuario,
                    u.Activo,
                    c.Fotografia,
                    c.NumeroPlaca,
                    c.MarcaVehiculo,
                    c.AnioVehiculo,
                    c.CV,
                    c.Calificacion,
                    c.NumeroViajes,
                    (SELECT COUNT(*) FROM Viajes v WHERE v.ConductorID = c.ConductorID) AS TotalViajes
                FROM Usuarios u
                LEFT JOIN Conductores c ON u.UsuarioID = c.ConductorID
                WHERE u.UsuarioID = @UsuarioID;
            `);

        if (resultado.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = resultado.recordset[0];


        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error al obtener detalles del usuario:", error);
        res.status(500).json({ error: "Error al obtener detalles del usuario" });
    }
};


export const darDeBajaUsuario = async (req, res) => {
  
    const { id,motivo, asistenteNombre } = req.body; // Motivo de la baja y nombre del asistente

    try {
        const pool = await getConnection();

        // Verificar si el usuario es un conductor
        const usuario = await pool.request()
            .input("UsuarioID", sql.Int, id)
            .query(`
                SELECT TipoUsuario FROM Usuarios WHERE UsuarioID = @UsuarioID;
            `);

        if (usuario.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const tipoUsuario = usuario.recordset[0].TipoUsuario;

        if (tipoUsuario === 'Conductor') {
            // Dar de baja a un conductor
            await pool.request()
                .input("UsuarioID", sql.Int, id)
                .input("Motivo", sql.NVarChar, motivo)
                .input("AsistenteNombre", sql.NVarChar, asistenteNombre)
                .query(`
                    UPDATE Usuarios SET Activo = 0 WHERE UsuarioID = @UsuarioID;
                    UPDATE Conductores SET Estatus='Inactivo' where ConductorId=@UsuarioID;
                    INSERT INTO BajasConductores (ConductorID, Motivo, BajaPor)
                    VALUES (@UsuarioID, @Motivo, @AsistenteNombre);
                `);
        } else {
            // Dar de baja a un asistente o administrador
            await pool.request()
                .input("UsuarioID", sql.Int, id)
                .input("Motivo", sql.NVarChar, motivo)
                .input("AsistenteNombre", sql.NVarChar, asistenteNombre)
                .query(`
                    UPDATE Usuarios SET Activo = 0 WHERE UsuarioID = @UsuarioID;

                    INSERT INTO BajasUsuarios (UsuarioID, Motivo, BajaPor)
                    VALUES (@UsuarioID, @Motivo, @AsistenteNombre);
                `);
        }

        res.status(200).json({ message: 'Usuario dado de baja correctamente' });
    } catch (error) {
        console.error("Error al dar de baja al usuario:", error);
        res.status(500).json({ error: "Error al dar de baja al usuario" });
    }
};


export const aprobarRechazarConductor = async (req, res) => {
    const { idConductor, estado } = req.body;

    if (!idConductor || !estado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let statusConductor, statusUsuario, msj = "";
    
    if (estado === 1) {
        statusConductor = "Activo";
        statusUsuario = 1; // Activo en la tabla Usuarios
        msj = "activado";
    } else if (estado === 2) {
        statusConductor = "Rechazado";
        statusUsuario = 0; // Inactivo en la tabla Usuarios
        msj = "rechazado";
    } else {
        return res.status(400).json({ error: 'Debe ingresar un estado valido' });
    }

    try {
        const pool = await getConnection();

        // Actualizar la tabla Conductores
        await pool.request()
            .input("ConductorID", sql.Int, idConductor)
            .input("status", sql.VarChar, statusConductor)
            .query(`
                UPDATE Conductores
                SET
                Estatus = @status
                WHERE ConductorID = @ConductorID;
            `);

        // Actualizar el campo 'Activo' en la tabla Usuarios
        await pool.request()
            .input("ConductorID", sql.Int, idConductor)
            .input("statusUsuario", sql.Bit, statusUsuario)  // Bit 1 = Activo, 0 = Inactivo
            .query(`
                UPDATE Usuarios
                SET
                Activo = @statusUsuario
                WHERE UsuarioID = @ConductorID;
            `);

        res.status(200).json({
            message: `El usuario con código ${idConductor} fue ${msj} con éxito.`,
        });

    } catch (error) {
        console.error('Error al Aprobar o Rechazar conductor:', error);
        res.status(500).json({ error: 'Error al Aprobar o Rechazar conductor' });
    }
};


// Crear una oferta
export const generarOferta = async (req, res) => {
    const { descripcion, descuento, fechaInicio, fechaFin } = req.body;
    try {
        await pool.query(
            `INSERT INTO Ofertas (Descripcion, Descuento, FechaInicio, FechaFin)
             VALUES (@descripcion, @descuento, @fechaInicio, @fechaFin)`,
            { descripcion, descuento, fechaInicio, fechaFin }
        );
        res.status(201).json({ message: 'Oferta creada exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la oferta.' });
    }
};

// Obtener todas las ofertas
export const getOfertas = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Ofertas WHERE Activo = 1`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las ofertas.' });
    }
};

// Desactivar oferta
export const desactivarOferta = async (req, res) =>{
    const { id } = req.body;
    try {
        await pool.query(`UPDATE Ofertas SET Activo = 0 WHERE OfertaID = @id`, { id });
        res.json({ message: 'Oferta desactivada.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar la oferta.' });
    }
};


// Actualizar datos del conductor y registrar cambios
export const updateConductorInfo = async (req, res) =>{

    const {id, telefono, marcaVehiculo, numeroPlaca,asistente } = req.body;

    try {
        const conductor = await pool.query(`SELECT * FROM Conductores WHERE ConductorID = @id`, { id });

        if (!conductor.recordset.length) {
            return res.status(404).json({ error: 'Conductor no encontrado.' });
        }

        // Registrar cambios en historial
        await pool.query(
            `INSERT INTO HistorialCambios (ConductorID, CampoModificado, ValorAnterior, ValorNuevo, RealizadoPor)
             VALUES (@id, 'Telefono', @valorAnterior, @nuevoValor, @asistente)`,
            {
                id,
                valorAnterior: conductor.recordset[0].Telefono,
                nuevoValor: telefono,
                asistente
            }
        );

        // Actualizar la información del conductor
        await pool.query(
            `UPDATE Conductores SET Telefono = @telefono, MarcaVehiculo = @marca, NumeroPlaca = @placa WHERE ConductorID = @id`,
            { telefono, marca: marcaVehiculo, placa: numeroPlaca, id }
        );

        res.json({ message: 'Información del conductor actualizada.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la información del conductor.' });
    }
};

// Generar reporte de vehículos
export const reporteVehiculos = async (req, res) =>{
    try {
        const result = await pool.query(`
            SELECT C.ConductorID, C.FotografiaVehiculo, C.NumeroPlaca, C.MarcaVehiculo, C.AnioVehiculo, C.Estatus
            FROM Conductores C
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el reporte de vehículos.' });
    }
};




