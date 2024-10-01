import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loginConductor = async (req, res) => {
    const { CorreoElectronico, Contrasena, CodigoEmpleado } = req.body;

    // Validar que se ingrese correo electrónico o código de empleado
    if (!CorreoElectronico && !CodigoEmpleado) {
        return res.status(400).json({ error: 'Debes ingresar correo electrónico o código de empleado.' });
    }
    if (!Contrasena) {
        return res.status(400).json({ error: 'Debes ingresar la contraseña.' });
    }
    try {
        const pool = await getConnection();
        let usuario;

        // Buscar al usuario por correo electrónico o código de empleado
        if (CorreoElectronico) {
            usuario = await pool.request()
                .input("CorreoElectronico", sql.VarChar, CorreoElectronico)
                .query("SELECT * FROM Usuarios WHERE CorreoElectronico = @CorreoElectronico AND TipoUsuario = 'Conductor';");
        } else if (CodigoEmpleado) {
            usuario = await pool.request()
                .input("CodigoEmpleado", sql.VarChar, CodigoEmpleado)
                .query("SELECT * FROM Usuarios WHERE CodigoEmpleado = @CodigoEmpleado AND TipoUsuario = 'Conductor';");
        }

        // Verificar si el usuario fue encontrado
        if (!usuario.recordset[0]) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userData = usuario.recordset[0];

        // Verificar la contraseña utilizando bcrypt
        const match = await bcrypt.compare(Contrasena, userData.Contrasena);
        if (!match) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Verificar si la contraseña es temporal
        if (userData.ContrasenaTemporal) {
            // Si es temporal, pedir al usuario que cambie su contraseña
            return res.status(200).json({
                message: 'Contraseña temporal, es necesario cambiar la contraseña.',
                temporal: true // Indicar al cliente que la contraseña es temporal
            });
        }

        // Si la contraseña no es temporal, el inicio de sesión es exitoso
        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            temporal: false // La contraseña no es temporal
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};


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
        await pool.request()
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
            ContrasenaTemporal
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
    const { ConductorID, ViajeID, Motivo } = req.body;

    try {
        const pool = await getConnection();

        // Verificar si el viaje fue aceptado
        const viaje = await pool.request()
            .input("ViajeID", sql.Int, ViajeID)
            .query("SELECT Estado FROM Viajes WHERE ViajeID = @ViajeID");

        if (viaje.recordset[0].Estado !== 'Aceptado') {
            return res.status(400).json({ error: 'El viaje no ha sido aceptado.' });
        }

        // Actualizar el estado del viaje a 'Cancelado'
        await pool.request()
            .input("ViajeID", sql.Int, ViajeID)
            .query("UPDATE Viajes SET Estado = 'Cancelado' WHERE ViajeID = @ViajeID");

        // Registrar la cancelación
        await pool.request()
            .input("ConductorID", sql.Int, ConductorID)
            .input("ViajeID", sql.Int, ViajeID)
            .input("Motivo", sql.VarChar, Motivo)
            .query("INSERT INTO Cancelaciones (ConductorID, ViajeID, Motivo) VALUES (@ConductorID, @ViajeID, @Motivo)");

        res.status(200).json({ message: 'Viaje cancelado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar el viaje' });
    }
};

export const reportarProblema = async (req, res) => {
    const { UsuarioID, ViajeID, Categoria, Descripcion, EvidenciaBase64 } = req.body;

    try {
        const pool = await getConnection();

        // Guardar el reporte del problema
        const reportId = await pool.request()
            .input("UsuarioID", sql.Int, UsuarioID)
            .input("ViajeID", sql.Int, ViajeID)
            .input("Categoria", sql.VarChar, Categoria)
            .input("Descripcion", sql.VarChar, Descripcion)
            .query("INSERT INTO ReportesProblemas (UsuarioID, ViajeID, Categoria, Descripcion) OUTPUT INSERTED.ReporteID VALUES (@UsuarioID, @ViajeID, @Categoria, @Descripcion)");

        const ReporteID = reportId.recordset[0].ReporteID;

        // Guardar el archivo PDF en base64
        if (EvidenciaBase64) {
            const base64Data = EvidenciaBase64.replace(/^data:application\/pdf;base64,/, '');
            const pdfFilename = `${uuidv4()}_evidencia.pdf`;
            const pdfFilePath = path.join(__dirname, '../uploads', pdfFilename);
            
            // Asegurarse de que la carpeta exista
            if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
                fs.mkdirSync(path.join(__dirname, '../uploads'));
            }

            // Escribir el archivo PDF
            fs.writeFileSync(pdfFilePath, base64Data, 'base64');

            // Actualizar el reporte con la ruta del archivo
            await pool.request()
                .input("ReporteID", sql.Int, ReporteID)
                .input("Evidencia", sql.VarChar, pdfFilename)
                .query("UPDATE ReportesProblemas SET Evidencia = @Evidencia WHERE ReporteID = @ReporteID");
        }

        res.status(200).json({ message: 'Problema reportado exitosamente' });
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
            .query("SELECT NombreCompleto, Calificacion, NumeroViajes, Comentarios FROM InformacionUsuarios WHERE UsuarioID = @UsuarioID");

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

        if (!viaje.recordset.length || viaje.recordset[0].Estado !== 'En curso') {
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

