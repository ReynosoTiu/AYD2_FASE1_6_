import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const loginUsuario = async (req, res) => {
    const { CorreoElectronico, Contrasena, NombreUsuario, CodigoEmpleado } = req.body;

    // Validar que se ingrese algún método de inicio de sesión
    if (!CorreoElectronico && !NombreUsuario && !CodigoEmpleado) {
        return res.status(400).json({ error: 'Debes ingresar correo electrónico, nombre de usuario o código de empleado.' });
    }
    if (!Contrasena) {
        return res.status(400).json({ error: 'Debes ingresar la contraseña.' });
    }

    try {
        const pool = await getConnection();
        let usuario;

        // Buscar al usuario por correo electrónico, nombre de usuario o código de empleado
        if (CorreoElectronico) {
            usuario = await pool.request()
                .input("CorreoElectronico", sql.VarChar, CorreoElectronico)
                .query("SELECT * FROM Usuarios WHERE CorreoElectronico = @CorreoElectronico;");
        } else if (NombreUsuario) {
            usuario = await pool.request()
                .input("NombreUsuario", sql.VarChar, NombreUsuario)
                .query("SELECT * FROM Usuarios WHERE NombreUsuario = @NombreUsuario ;");
        } else if (CodigoEmpleado) {
            usuario = await pool.request()
                .input("CodigoEmpleado", sql.VarChar, CodigoEmpleado)
                .query("SELECT * FROM Usuarios WHERE CodigoEmpleado = @CodigoEmpleado;");
        }

        // Verificar si el usuario fue encontrado
        if (!usuario.recordset[0]) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userData = usuario.recordset[0];

        // Verificar si el usuario está activo
        if (userData.Activo === false) {
            return res.status(401).json({ error: 'Usuario no Autorizado.' });
        }

        // Verificar la contraseña utilizando bcrypt
        const match = await bcrypt.compare(Contrasena, userData.Contrasena);
        if (!match) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Si el usuario es un conductor, verificar que esté activo en la tabla Conductores
        if (userData.TipoUsuario === 'Conductor') {
            const conductor = await pool.request()
                .input("ConductorID", sql.Int, userData.UsuarioID)
                .query("SELECT Estatus FROM Conductores WHERE ConductorID = @ConductorID;");

            // Verificar si el conductor está activo
            if (conductor.recordset[0]?.Estatus !== 'Activo') {
                return res.status(401).json({ error: 'Conductor no activo.' });
            }
        }

        // Lógica para verificar contraseña temporal (solo para conductores)
        if (userData.TipoUsuario === 'Conductor' && userData.ContrasenaTemporal) {
            return res.status(200).json({
                message: 'Contraseña temporal, es necesario cambiar la contraseña.',
                temporal: true, // Indicar al cliente que la contraseña es temporal
                tipoUsuario: userData.TipoUsuario, // Devolver el tipo de usuario
                userId: userData.UsuarioID
            });
        }

        // Si la contraseña no es temporal, el inicio de sesión es exitoso
        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            temporal: false, // La contraseña no es temporal
            tipoUsuario: userData.TipoUsuario, // Devolver el tipo de usuario
            userId: userData.UsuarioID // Devolver el ID del usuario
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

export const cambiarContrasena = async (req, res) => {
    const { UsuarioID, ContrasenaActual, NuevaContrasena } = req.body;

    // Validar que se ingresen todos los campos requeridos
    if (!UsuarioID || !ContrasenaActual || !NuevaContrasena) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    try {
        const pool = await getConnection();

        // Verificar si el usuario existe y obtener su contraseña
        const usuario = await pool.request()
            .input("UsuarioID", sql.Int, UsuarioID)
            .query("SELECT Contrasena, ContrasenaTemporal FROM Usuarios WHERE UsuarioID = @UsuarioID");

        if (!usuario.recordset[0]) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña actual
        const contrasenaActualHash = usuario.recordset[0].Contrasena;
        const contrasenaCoincide = await bcrypt.compare(ContrasenaActual, contrasenaActualHash);
        
        if (!contrasenaCoincide) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        // Validar la nueva contraseña (opcional)
        if (NuevaContrasena.length < 8) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' });
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
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
};

export const listaViajes = async (req, res) => {
    const { ConductorID, ViajeID } = req.body;

    try {
        const pool = await getConnection();

        // Verificar si el viaje ya fue aceptado
        const viajes = await pool.request()
            .input("ViajeID", sql.Int, ViajeID)
            .query("SELECT * FROM Viajes;");


        if (!viajes.recordset[0]) {
            return res.status(404).json({ error: 'No se encontraron viajes.' });
        }

        res.status(200).json(viajes.recordset[0]);

    } catch (error) {
        res.status(500).json({ error: 'Error cargar listado de viajes' });
    }
};

export const verInformacionViaje = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();

        const usuarioInfo = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Viajes WHERE ViajeID = @id");

        if (!usuarioInfo.recordset[0]) {
            return res.status(404).json({ error: 'Información del viaje no encontrada' });
        }

        res.status(200).json(usuarioInfo.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener información del viaje' });
    }
};