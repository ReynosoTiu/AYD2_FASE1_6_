import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';


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
        Direccion
    } = req.body;

    // Validar la entrada
    if (!NombreCompleto || !Telefono || !Edad || !DPI || !CorreoElectronico || !Contrasena || !ConfirmarContrasena || !Genero || !EstadoCivil || !Direccion) {
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
            .query(`
                INSERT INTO Usuarios (NombreCompleto, Telefono, Edad, DPI, CorreoElectronico, Contrasena, Direccion, Genero, EstadoCivil, TipoUsuario)
                OUTPUT INSERTED.UsuarioID
                VALUES (@NombreCompleto, @Telefono, @Edad, @DPI, @CorreoElectronico, @Contrasena, @Direccion, @Genero, @EstadoCivil, 'Usuario');
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
    const { viajeId } = req.params;

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('viajeId', sql.Int, viajeId)
            .query(`
                SELECT c.Nombre AS nombreConductor, c.NumeroPlaca, v.Fotografia AS fotoAutomovil, v.Marca AS marcaAutomovil 
                FROM Conductores c 
                JOIN Viajes v ON v.ConductorID = c.ConductorID 
                WHERE v.ViajeID = @viajeId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener información del conductor:', error);
        res.status(500).json({ error: 'Error al obtener información del conductor' });
    }
};

export const reportarProblema = async (req, res) => {
    const { tipoProblema, nombreConductor, numeroPlaca, descripcion, fechaProblema } = req.body;

    if (!descripcion || (tipoProblema === 'conductor' && (!nombreConductor || !numeroPlaca))) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const pool = await getConnection();

        await pool.request()
            .input('tipoProblema', sql.VarChar, tipoProblema)
            .input('nombreConductor', sql.VarChar, nombreConductor || null)
            .input('numeroPlaca', sql.VarChar, numeroPlaca || null)
            .input('descripcion', sql.VarChar, descripcion)
            .input('fechaProblema', sql.Date, fechaProblema || null)
            .query(`
                INSERT INTO Reportes (TipoProblema, NombreConductor, NumeroPlaca, Descripcion, FechaProblema) 
                VALUES (@tipoProblema, @nombreConductor, @numeroPlaca, @descripcion, @fechaProblema)
            `);

        res.status(201).json({ message: 'Problema reportado exitosamente' });
    } catch (error) {
        console.error('Error al reportar problema:', error);
        res.status(500).json({ error: 'Error al reportar problema' });
    }
};

export const cancelarViaje = async (req, res) => {
    const { viajeId, motivoCancelacion, justificacion, quienCancela, usuarioId, conductorId } = req.body;

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
        const rolCancelacion = quienCancela === 'Usuario' ? 1 : 2;  // 1 para Usuario, 2 para Conductor
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
