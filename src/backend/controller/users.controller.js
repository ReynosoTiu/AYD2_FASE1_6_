import { getConnection, sql } from "../database/connection.js";


export const login = async (req, res) => {
    const { nombre_usuario, contrasenia } = req.body;

    if (nombre_usuario == null || contrasenia == null) {
        return res.status(400).json({ msg: "Bad Request. Please provide a username and password" });
    }

    try {
        const pool = await getConnection();
        
        const result = await pool
            .request()
            .input("nombre_usuario", sql.VarChar, nombre_usuario)
            .query(`
                SELECT u.id_usuario, u.nombre_usuario, u.contrasenia, r.nombre_rol
                FROM Usuarios u
                JOIN Rol r ON u.id_rol = r.id_rol
                WHERE u.nombre_usuario = @nombre_usuario;
            `);
        
        if (result.recordset.length === 0) {
            return res.status(403).json({ msg: "Unauthorized. User not found" });
        }
        
        const user = result.recordset[0];

        const match = contrasenia == user.contrasenia
        if (!match) {
            return res.status(401).json({ msg: "Unauthorized. Incorrect password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id_usuario,
                username: user.nombre_usuario,
                role: user.nombre_rol
            }
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
};