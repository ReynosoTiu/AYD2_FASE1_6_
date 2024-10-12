import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const registerUsuario = async (req, res) => {
    const {
        NombreCompleto,
        Telefono,
        Edad,
        DPI,
        CorreoElectronico,
        Contrasena,
        ConfirmarContrasena,
        Genero,
        EstadoCivil,
        Direccion,
        FechaNacimiento
    } = req.body;

    // Validar la entrada
    if (!NombreCompleto || !Telefono || !Edad || !DPI || !CorreoElectronico || !Contrasena || !ConfirmarContrasena || !Genero || !EstadoCivil || !Direccion || !FechaNacimiento) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (Contrasena !== ConfirmarContrasena) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
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

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(Contrasena, 10);

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
            .input("FechaNacimiento", sql.DateTime, FechaNacimiento)
            .query(`
                INSERT INTO Usuarios (NombreCompleto, Telefono, Edad, DPI, CorreoElectronico, Contrasena, Direccion, Genero, EstadoCivil, TipoUsuario, FechaNacimiento)
                OUTPUT INSERTED.UsuarioID
                VALUES (@NombreCompleto, @Telefono, @Edad, @DPI, @CorreoElectronico, @Contrasena, @Direccion, @Genero, @EstadoCivil, 'Usuario', @FechaNacimiento);
            `);

        const UsuarioID = usuarioResult.recordset[0].UsuarioID;

        // Insertar datos en la tabla InformacionUsuarios (opcional)
        await pool.request()
            .input("UsuarioID", sql.Int, UsuarioID)
            .query(`
                INSERT INTO InformacionUsuarios (UsuarioID)
                VALUES (@UsuarioID);
            `);

        res.status(201).json({
            message: 'Usuario registrado con éxito',
            UsuarioID
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};
export const getInfoConductor = async (req, res) => {
    const { id } = req.params;  

    try {
        const pool = await getConnection();

        const conductorDetalles = await pool.request()
            .input("ConductorID", sql.Int, id)
            .query(`
                SELECT 
                    U.NombreCompleto,                   
                    C.NumeroPlaca,
                    C.MarcaVehiculo,
                    C.AnioVehiculo,
                    C.FotografiaVehiculo                   
                    FROM Conductores C
                INNER JOIN Usuarios U ON C.ConductorID = U.UsuarioID
                WHERE C.ConductorID = @ConductorID;
            `);

        if (!conductorDetalles.recordset[0]) {
            return res.status(404).json({ message: 'Conductor no encontrado.' });
        }

        const conductor = conductorDetalles.recordset[0];

        const uploadDir = path.join(__dirname, '../uploads');       
        const vehicleImagePath = path.join(uploadDir, 'vehicleImages', conductor.FotografiaVehiculo);

        // Leer el archivo CV y convertirlo a base64
       
        // Leer la imagen del vehículo y convertirla a base64
        const vehicleImageBase64 = fs.existsSync(vehicleImagePath) ? fs.readFileSync(vehicleImagePath, 'base64') : null;

        // Retornar los detalles completos del conductor, incluyendo archivos en base64
        res.status(200).json({
            ...conductor,
            FotografiaVehiculo: conductor.FotografiaVehiculo
        });

    } catch (error) {
        console.error('Error al obtener los detalles del conductor:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del conductor' });
    }
};

export const reportarProblema = async (req, res) => {
    const { viajeId, usuarioId,conductorId,categoria,descripcion  } = req.body;

    if (!viajeId || !usuarioId||!conductorId||!categoria||!descripcion) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const pool = await getConnection();

        // Iniciar transacción
       // await pool.request().query('BEGIN TRANSACTION');

        // 1. Insertar la cancelación en la tabla Cancelaciones
        const rolCancelacion =  1 ;  // 1 para Usuario, 2 para Conductor
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
    } catch (error) {
        console.error('Error al reportar problema:', error);
        res.status(500).json({ error: 'Error al reportar problema' });
    }
};

export const cancelarViaje = async (req, res) => {
    const { viajeId, motivoCancelacion, justificacion,  usuarioId, conductorId } = req.body;

    // Validar si falta el motivo de cancelación
    if (!motivoCancelacion) {
        return res.status(400).json({ error: 'El motivo de cancelación es obligatorio' });
    }

    // Validar quien está cancelando
    if (!quienCancela || (quienCancela !== 'Usuario' && quienCancela !== 'Conductor')) {
        return res.status(400).json({ error: 'Debe especificar si la cancelación es realizada por "Usuario" o "Conductor"' });
    }

    try {
        const pool = await getConnection();

        // Iniciar transacción
       // await pool.request().query('BEGIN TRANSACTION');

        // 1. Insertar la cancelación en la tabla Cancelaciones
        const rolCancelacion =  1 ;  // 1 para Usuario, 2 para Conductor
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


export const pedirViaje = async (req, res) => {
    const { zonaInicio, zonaFin, usuarioId } = req.body;

    if (!zonaInicio || !zonaFin || !usuarioId) {
        return res.status(400).json({ error: 'Zona de inicio, zona de fin y UsuarioID son requeridos' });
    }

    try {
        const pool = await getConnection();

        // Obtener la tarifa de la tabla tarifas
        const tarifaResult = await pool.request()
            .input('zonaInicio', sql.VarChar, zonaInicio)
            .input('zonaFin', sql.VarChar, zonaFin)
            .query(`
                SELECT tarifa 
                FROM tarifas 
                WHERE punto_partida = @zonaInicio AND punto_destino = @zonaFin
            `);

        if (tarifaResult.recordset.length === 0) {
            return res.status(400).json({ error: 'No existe tarifa para las zonas seleccionadas' });
        }

        const tarifa = tarifaResult.recordset[0].tarifa;  // Ajustar el nombre del campo a minúsculas

        // Insertar el viaje en la tabla Viajes
        const result = await pool.request()
            .input('usuarioId', sql.Int, usuarioId)
            .input('zonaInicio', sql.VarChar, zonaInicio)
            .input('zonaFin', sql.VarChar, zonaFin)
            .input('tarifa', sql.Decimal, tarifa)
            .query(`
                INSERT INTO Viajes (UsuarioID, ZonaInicio, ZonaFin, FechaHoraInicio, Tarifa, Estado)
                OUTPUT INSERTED.ViajeID
                VALUES (@usuarioId, @zonaInicio, @zonaFin, GETDATE(), @tarifa, 'Pendiente');
            `);

        res.status(201).json({
            viajeId: result.recordset[0].ViajeID,
            tarifa,
            estado: 'Pendiente'
        });
    } catch (error) {
        console.error('Error al solicitar viaje:', error);
        res.status(500).json({ error: 'Error al solicitar viaje' });
    }
};


export const viajeActivo = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const detalleViajeActivo = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT v.ViajeID as idViaje, v.Tarifa as Tarifa, v.ZonaInicio as puntoPartida, v.ZonaFin as puntoLlegada, v.ConductorID as idConductor,
                u.NombreCompleto as nombreUsuario, v.FechaHoraInicio as fecha, c.NumeroPlaca as placas
                FROM Viajes as v
                inner join Usuarios as u
                ON  v.ConductorID = u.UsuarioID 
                inner join Conductores as c
                ON c.ConductorID = v.ConductorID
                WHERE v.UsuarioID = @id AND v.Estado = 'Aceptado';
            `);

        if (!detalleViajeActivo.recordset[0]) {
            return res.status(404).json({ message: 'No tienes viajes activos.' });
        }

        const viaje = detalleViajeActivo.recordset[0];

        res.status(200).json({
            ...viaje,
        });

    } catch (error) {
        console.error('Error al obtener los viajes activos', error);
        res.status(500).json({ error: 'Error al obtener los viajes activos' });
    }
};