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
