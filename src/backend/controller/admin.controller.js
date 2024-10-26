import { getConnection, sql } from "../database/connection.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Definir __dirname manualmente para módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Reporte 1: Viajes realizados por cada conductor
export const reporteViajesConductores = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.query(`
            SELECT C.ConductorID, U.NombreCompleto, COUNT(V.ViajeID) AS TotalViajes, 
                   AVG(Cal.Calificacion) AS PromedioCalificacion
            FROM Conductores C
            INNER JOIN Usuarios U ON C.ConductorID = U.UsuarioID
            LEFT JOIN Viajes V ON V.ConductorID = C.ConductorID
            LEFT JOIN Calificaciones Cal ON Cal.ViajeID = V.ViajeID
            GROUP BY C.ConductorID, U.NombreCompleto;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al generar el reporte de viajes:', error);
        res.status(500).json({ error: 'Error al generar el reporte de viajes' });
    }
};

// Reporte 2: Cancelaciones de viajes
export const reporteCancelaciones = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.query(`
            SELECT C.ConductorID, U.NombreCompleto, COUNT(Can.CancelacionID) AS TotalCancelaciones, 
                   Can.Motivo, Can.RolCancelacion
            FROM Cancelaciones Can
            INNER JOIN Usuarios U ON Can.UsuarioID = U.UsuarioID
            LEFT JOIN Conductores C ON C.ConductorID = Can.ConductorID
            GROUP BY C.ConductorID, U.NombreCompleto, Can.Motivo, Can.RolCancelacion;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al generar el reporte de cancelaciones:', error);
        res.status(500).json({ error: 'Error al generar el reporte de cancelaciones' });
    }
};

export const bajaAsistente = async (req, res) => {
    const { AsistenteID, Motivo, BajaPor } = req.body;

    // Validar la entrada
    if (!AsistenteID || !Motivo || !BajaPor) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const pool = await getConnection();

        // Verificar si el asistente existe y está activo
        const asistente = await pool.request()
            .input("AsistenteID", sql.Int, AsistenteID)
            .query(`
                SELECT U.Activo 
                FROM Usuarios U 
                JOIN Asistentes A ON U.UsuarioID = A.AsistenteID 
                WHERE A.AsistenteID = @AsistenteID;
            `);

        if (asistente.recordset.length === 0) {
            return res.status(404).json({ error: 'El asistente no existe' });
        }

        if (asistente.recordset[0].Activo === 0) {
            return res.status(400).json({ error: 'El asistente ya está dado de baja' });
        }

        // Dar de baja al asistente (marcarlo como inactivo)
        await pool.request()
            .input("AsistenteID", sql.Int, AsistenteID)
            .query(`
                UPDATE Usuarios 
                SET Activo = 0 
                WHERE UsuarioID = @AsistenteID;
            `);

        // Registrar la baja en la tabla BajasUsuarios
        await pool.request()
            .input("AsistenteID", sql.Int, AsistenteID)
            .input("Motivo", sql.NVarChar, Motivo)
            .input("BajaPor", sql.NVarChar, BajaPor)
            .query(`
                INSERT INTO BajasUsuarios (UsuarioID, Motivo, BajaPor) 
                VALUES (@AsistenteID, @Motivo, @BajaPor);
            `);

        res.status(200).json({ message: 'Asistente dado de baja exitosamente' });

    } catch (error) {
        console.error('Error al dar de baja al asistente:', error);
        res.status(500).json({ error: 'Error al dar de baja al asistente' });
    }
};


export const obtenerAsistentes = async (req, res) => {
    const { estado } = req.body;  // Parámetro opcional para filtrar por estado (activo/inactivo)

    try {
        const pool = await getConnection();
        
        let query = `
            SELECT 
                A.AsistenteID, 
                U.Nombre, 
                U.Correo, 
                U.Activo, 
                U.FechaRegistro 
            FROM Asistentes A 
            JOIN Usuarios U ON A.AsistenteID = U.UsuarioID
        `;

        // Si se proporciona un filtro por estado, agregarlo a la consulta
        if (estado) {
            query += ` WHERE U.Activo = @Estado`;
        }

        const request = pool.request();
        if (estado !== undefined) {
            request.input('Estado', sql.Bit, estado);  // 1 para activos, 0 para inactivos
        }

        const resultado = await request.query(query);

        res.status(200).json({
            asistentes: resultado.recordset,
            total: resultado.recordset.length
        });
    } catch (error) {
        console.error('Error al obtener los asistentes:', error);
        res.status(500).json({ error: 'Error al obtener los asistentes' });
    }
};

