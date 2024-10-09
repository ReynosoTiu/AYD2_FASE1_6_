import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const registerConductor = async (req, res) => {
    const {
        NombreCompleto,
        Telefono,
        Edad,
        DPI,
        CorreoElectronico,
        CV,  // PDF en base64
        Fotografia,  // Imagen del conductor en base64
        FotografiaVehiculo,  // Imagen del vehículo en base64
        NumeroPlaca,
        MarcaVehiculo,
        AnioVehiculo,
        Genero,
        EstadoCivil,
        Direccion
    } = req.body;

    // Validar la entrada
    if (!NombreCompleto || !Telefono || !Edad || !DPI || !CorreoElectronico || !CV || !Fotografia || !FotografiaVehiculo || !NumeroPlaca || !MarcaVehiculo || !AnioVehiculo || !Genero || !EstadoCivil || !Direccion) {
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

        // Verificar si el número de placa ya existe
        const existingPlaca = await pool
            .request()
            .input("NumeroPlaca", sql.VarChar, NumeroPlaca)
            .query(`
                SELECT COUNT(*) AS Count 
                FROM Conductores 
                WHERE NumeroPlaca = @NumeroPlaca;
            `);

        if (existingPlaca.recordset[0].Count > 0) {
            return res.status(400).json({ error: 'El número de placa ya está en uso' });
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

        // Guardar las imágenes (conductor y vehículo)
        const base64ImageData = Fotografia.replace(/^data:image\/\w+;base64,/, '');
        const imageFilename = `${uuidv4()}_profile.png`;
        const imageFilePath = path.join(uploadDir, 'profileImages', imageFilename);
        if (!fs.existsSync(path.join(uploadDir, 'profileImages'))) {
            fs.mkdirSync(path.join(uploadDir, 'profileImages'));
        }
        fs.writeFileSync(imageFilePath, base64ImageData, 'base64');

        const base64VehicleImageData = FotografiaVehiculo.replace(/^data:image\/\w+;base64,/, '');
        const vehicleImageFilename = `${uuidv4()}_vehicle.png`;
        const vehicleImageFilePath = path.join(uploadDir, 'vehicleImages', vehicleImageFilename);
        if (!fs.existsSync(path.join(uploadDir, 'vehicleImages'))) {
            fs.mkdirSync(path.join(uploadDir, 'vehicleImages'));
        }
        fs.writeFileSync(vehicleImageFilePath, base64VehicleImageData, 'base64');

        // Insertar datos en la tabla Usuarios y obtener el ID
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
            .query(`
                INSERT INTO Usuarios (NombreCompleto, Telefono, Edad, DPI, CorreoElectronico, Contrasena, Direccion, Genero, EstadoCivil, TipoUsuario, CodigoEmpleado, ContrasenaTemporal)
                OUTPUT INSERTED.UsuarioID
                VALUES (@NombreCompleto, @Telefono, @Edad, @DPI, @CorreoElectronico, @Contrasena, @Direccion, @Genero, @EstadoCivil, 'Conductor', @CodigoEmpleado, 1);
            `);

        const ConductorID = usuarioResult.recordset[0].UsuarioID; // Cambiado a UsuarioID

        // Insertar datos en la tabla Conductores
        const conductorResult = await pool.request()
            .input("ConductorID", sql.Int, ConductorID)
            .input("Fotografia", sql.VarChar, imageFilename)
            .input("FotografiaVehiculo", sql.VarChar, vehicleImageFilename)
            .input("NumeroPlaca", sql.VarChar, NumeroPlaca)
            .input("MarcaVehiculo", sql.VarChar, MarcaVehiculo)
            .input("AnioVehiculo", sql.Int, AnioVehiculo)
            .input("CV", sql.VarChar, cvFilename)
            .query(`
                INSERT INTO Conductores (ConductorID, Fotografia, FotografiaVehiculo, NumeroPlaca, MarcaVehiculo, AnioVehiculo, CV)
                VALUES (@ConductorID, @Fotografia, @FotografiaVehiculo, @NumeroPlaca, @MarcaVehiculo, @AnioVehiculo, @CV);
            `);

        res.status(201).json({
            message: 'Conductor registrado con éxito',
            CodigoEmpleado,
            ContrasenaTemporal,
            ConductorID
        });

    } catch (error) {
        console.error('Error al registrar el conductor:', error);
        res.status(500).json({ error: 'Error al registrar el conductor' });
    }
};


export const aceptarViaje = async (req, res) => {
    const { ConductorID, ViajeID } = req.body;

    try {
        const pool = await getConnection();

        // Verificar si el viaje ya fue aceptado
        const viaje = await pool.request()
            .input("ViajeID", sql.Int, ViajeID)
            .query("SELECT Estado FROM Viajes WHERE ViajeID = @ViajeID");

        if (viaje.recordset[0].Estado !== 'Pendiente') {
            return res.status(400).json({ error: 'El viaje ya fue aceptado o está en progreso.' });
        }

        // Actualizar el estado del viaje
        await pool.request()
            .input("ConductorID", sql.Int, ConductorID)
            .input("ViajeID", sql.Int, ViajeID)
            .query("UPDATE Viajes SET ConductorID = @ConductorID, Estado = 'Aceptado' WHERE ViajeID = @ViajeID");

        res.status(200).json({ message: 'Viaje aceptado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al aceptar el viaje' });
    }
};


export const cancelarViaje = async (req, res) => {
    const { viajeId, motivoCancelacion, justificacion,  usuarioId, conductorId } = req.body;

    // Validar si falta el motivo de cancelación
    if (!motivoCancelacion) {
        return res.status(400).json({ error: 'El motivo de cancelación es obligatorio' });
    }
    try {
        const pool = await getConnection();

        // Iniciar transacción
       // await pool.request().query('BEGIN TRANSACTION');

        // 1. Insertar la cancelación en la tabla Cancelaciones
        const rolCancelacion =  2;  // 1 para Usuario, 2 para Conductor
        await pool.request()
            .input('viajeId', sql.Int, viajeId)
            .input('usuarioId', sql.Int, usuarioId || null)  // Puede ser null si lo cancela el conductor
            .input('conductorId', sql.Int, conductorId || null)  // Puede ser null si lo cancela el usuario
            .input('motivoCancelacion', sql.VarChar, motivoCancelacion)
            .input('justificacion', sql.VarChar, justificacion)
            .input('rolCancelacion', sql.Int, rolCancelacion)
            .query(`
                INSERT INTO Cancelaciones (ConductorID, UsuarioID, ViajeID, Motivo, RolCancelacion, Justificacion)
                VALUES (@conductorId, @usuarioId, @viajeId, @motivoCancelacion, @rolCancelacion, @justificacion)
            `);

        // 2. Actualizar el estado del viaje en la tabla Viajes
        await pool.request()
            .input('viajeId', sql.Int, viajeId)
            .query(`
                UPDATE Viajes 
                SET Estado = 'Cancelado' 
                WHERE ViajeID = @viajeId
            `);

        // Confirmar la transacción
       // await pool.request().query('COMMIT TRANSACTION');

        res.status(200).json({ message: 'Viaje cancelado exitosamente' });
    }  catch (error) {
        console.error('Error al solicitar viaje:', error);
        res.status(500).json({ error: 'Error al solicitar viaje' });
    }
};

export const reportarProblema = async (req, res) => {
    const { viajeId, usuarioId,conductorId,categoria,descripcion, evidencia } = req.body;

    if (!viajeId || !usuarioId||!conductorId||!categoria||!descripcion) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    try {
        const pool = await getConnection();

        // Iniciar transacción
       // await pool.request().query('BEGIN TRANSACTION');

        // 1. Insertar la cancelación en la tabla Cancelaciones
       if(!evidencia){
        const rolCancelacion =  2 ;  // 1 para Usuario, 2 para Conductor
        await pool.request()
            .input('viajeId', sql.Int, viajeId)
            .input('usuarioId', sql.Int, usuarioId || null)  // Puede ser null si lo cancela el conductor
            .input('conductorId', sql.Int, conductorId || null)  // Puede ser null si lo cancela el usuario
            .input('rolCancelacion', sql.Int, rolCancelacion)
            .input('categorias', sql.VarChar, categoria)
            .input('descripciones', sql.VarChar, descripcion)
            .query(`
                INSERT INTO ReportesProblemas (ConductorID, UsuarioID, ViajeID,  RolCancelacion, Categoria,Descripcion)
                VALUES (@conductorId, @usuarioId, @viajeId,  @rolCancelacion, @categorias, @descripciones)
            `);        
        res.status(201).json({ message: 'Problema reportado exitosamente' });
       }else{
        const rolCancelacion =  2 ;  // 1 para Usuario, 2 para Conductor
         // Crear la carpeta 'uploads' si no existe
         const uploadDir = path.join(__dirname, '../uploads');
         if (!fs.existsSync(uploadDir)) {
             fs.mkdirSync(uploadDir);
         }
 
         //
         // Guardar las imágenes (conductor y vehículo)
         const base64ImageData = evidencia.replace(/^data:image\/\w+;base64,/, '');
         const imageFilename = `${uuidv4()}_reporteProblema.png`;
         const imageFilePath = path.join(uploadDir, 'reporteProblemas', imageFilename);
         if (!fs.existsSync(path.join(uploadDir, 'reporteProblemas'))) {
             fs.mkdirSync(path.join(uploadDir, 'reporteProblemas'));
         }
         fs.writeFileSync(imageFilePath, base64ImageData, 'base64');
         
        await pool.request()
            .input('viajeId', sql.Int, viajeId)
            .input('usuarioId', sql.Int, usuarioId || null)  // Puede ser null si lo cancela el conductor
            .input('conductorId', sql.Int, conductorId || null)  // Puede ser null si lo cancela el usuario
            .input('rolCancelacion', sql.Int, rolCancelacion)
            .input('categorias', sql.VarChar, categoria)
            .input('descripciones', sql.VarChar, descripcion)
            .input('evidencia', sql.VarChar, imageFilename)
            .query(`
                INSERT INTO ReportesProblemas (ConductorID, UsuarioID, ViajeID,  RolCancelacion, Categoria,Descripcion,Evidencia)
                VALUES (@conductorId, @usuarioId, @viajeId,  @rolCancelacion, @categorias, @descripciones,@evidencia)
            `);        
        res.status(201).json({ message: 'Problema reportado exitosamente' });
      
       }
    } catch (error) {
        console.error('Error al reportar el problema:', error);
        res.status(500).json({ error: 'Error al reportar el problema' });
    }
};


export const verInformacionUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();

        const usuarioInfo = await pool.request()
            .input("UsuarioID", sql.Int, id)
            .query("SELECT NombreCompleto,Telefono,CorreoElectronico FROM Usuarios WHERE UsuarioID = @UsuarioID");

        if (!usuarioInfo.recordset[0]) {
            return res.status(404).json({ error: 'Información del usuario no encontrada' });
        }

        res.status(200).json(usuarioInfo.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener información del usuario' });
    }
};

export const finalizarViaje = async (req, res) => {
    const { ViajeID, PagoRecibido } = req.body;

    // Validar la entrada
    if (!ViajeID || typeof PagoRecibido !== 'boolean') {
        return res.status(400).json({ error: 'El ViajeID y el estado del pago son obligatorios' });
    }

    try {
        const pool = await getConnection();

        // Verificar el estado del viaje antes de finalizar
        const viaje = await pool.request()
            .input("ViajeID", sql.Int, ViajeID)
            .query("SELECT Estado FROM Viajes WHERE ViajeID = @ViajeID");

        if (!viaje.recordset.length || viaje.recordset[0].Estado !== 'Aceptado') {
            return res.status(400).json({ error: 'El viaje no puede ser finalizado' });
        }

        // Finalizar el viaje
        await pool.request()
            .input("ViajeID", sql.Int, ViajeID)
            .input("PagoRecibido", sql.Bit, PagoRecibido)
            .query("UPDATE Viajes SET Estado = 'Finalizado', PagoRecibido = @PagoRecibido, FechaHoraFin = GETDATE() WHERE ViajeID = @ViajeID");

        res.status(200).json({ message: 'Viaje finalizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al finalizar el viaje' });
    }
};

export const cambiarContrasena = async (req, res) => {
    const { UsuarioID, ContrasenaActual, NuevaContrasena } = req.body;

    try {
        const pool = await getConnection();

        // Verificar si el usuario existe y obtener su contraseña
        const usuario = await pool.request()
            .input("UsuarioID", sql.Int, UsuarioID)
            .query("SELECT Contrasena FROM Usuarios WHERE UsuarioID = @UsuarioID");

        if (!usuario.recordset[0]) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña actual
        const contrasenaActualHash = usuario.recordset[0].Contrasena;
        const contrasenaCoincide = await bcrypt.compare(ContrasenaActual, contrasenaActualHash);
        
        if (!contrasenaCoincide) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        // Hashear la nueva contraseña antes de almacenarla
        const nuevaContrasenaHash = await bcrypt.hash(NuevaContrasena, 10);

        // Actualizar la contraseña y el campo ContrasenaTemporal en la base de datos
        await pool.request()
            .input("UsuarioID", sql.Int, UsuarioID)
            .input("NuevaContrasena", sql.VarChar, nuevaContrasenaHash)
            .query("UPDATE Usuarios SET Contrasena = @NuevaContrasena, ContrasenaTemporal = 0 WHERE UsuarioID = @UsuarioID");

        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
};

