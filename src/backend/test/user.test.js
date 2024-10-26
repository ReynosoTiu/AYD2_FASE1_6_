import request from 'supertest';
import app from '../app'; // Asegúrate de importar tu aplicación Express

describe('API Endpoints', () => {
    // Prueba para registerUsuario
    describe('POST /registerUsuario', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/registerUsuario')
                .send({
                    NombreCompleto: 'Juan Perez',
                    Telefono: '123456789',
                    Edad: 30,
                    DPI: '1234567890101',
                    CorreoElectronico: 'juan@example.com',
                    Contrasena: 'password123',
                    ConfirmarContrasena: 'password123',
                    Genero: 'Masculino',
                    EstadoCivil: 'Soltero',
                    Direccion: 'Calle Falsa 123',
                    FechaNacimiento: '1990-01-01T00:00:00Z',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Usuario registrado con éxito');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/registerUsuario')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Todos los campos son obligatorios');
        });
    });

    // Prueba para getInfoConductor
    describe('GET /getInfoConductor/:id', () => {
        it('should return conductor details successfully', async () => {
            const response = await request(app).get('/getInfoConductor/1');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('NombreCompleto');
        });

        it('should return 404 if conductor not found', async () => {
            const response = await request(app).get('/getInfoConductor/999');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Conductor no encontrado.');
        });
    });

    // Prueba para reportarProblema
    describe('POST /reportarProblema', () => {
        it('should report a problem successfully', async () => {
            const response = await request(app)
                .post('/reportarProblema')
                .send({
                    viajeId: 1,
                    usuarioId: 1,
                    conductorId: 1,
                    categoria: 'Problema de seguridad',
                    descripcion: 'Descripción del problema',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Problema reportado exitosamente');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/reportarProblema')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Faltan datos requeridos');
        });
    });

    // Prueba para cancelarViaje
    describe('POST /cancelarViaje', () => {
        it('should cancel a trip successfully', async () => {
            const response = await request(app)
                .post('/cancelarViaje')
                .send({
                    viajeId: 1,
                    motivoCancelacion: 'Motivo de cancelación',
                    justificacion: 'Justificación de la cancelación',
                    usuarioId: 1,
                    conductorId: null,
                    quienCancela: 'Usuario',
                });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Viaje cancelado exitosamente');
        });

        it('should return 400 if cancellation reason is missing', async () => {
            const response = await request(app)
                .post('/cancelarViaje')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'El motivo de cancelación es obligatorio');
        });
    });

    // Prueba para pedirViaje
    describe('POST /pedirViaje', () => {
        it('should request a trip successfully', async () => {
            const response = await request(app)
                .post('/pedirViaje')
                .send({
                    zonaInicio: 'Zona A',
                    zonaFin: 'Zona B',
                    usuarioId: 1,
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('viajeId');
            expect(response.body).toHaveProperty('tarifa');
            expect(response.body).toHaveProperty('estado', 'Pendiente');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/pedirViaje')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Zona de inicio, zona de fin y UsuarioID son requeridos');
        });
    });

    // Prueba para viajeActivo
    describe('GET /viajeActivo/:id', () => {
        it('should return active trip details successfully', async () => {
            const response = await request(app).get('/viajeActivo/1');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 500 if an error occurs', async () => {
            // Simula un error en la base de datos, por ejemplo, al enviar un ID no existente
            const response = await request(app).get('/viajeActivo/999');
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Error al obtener los viajes activos');
        });
    });

    // Prueba para nuevoViaje
    describe('GET /nuevoViaje/:id', () => {
        it('should return pending or accepted trips successfully', async () => {
            const response = await request(app).get('/nuevoViaje/1');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 500 if an error occurs', async () => {
            const response = await request(app).get('/nuevoViaje/999');
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Error al obtener los viajes pendientes o aceptados');
        });
    });

    // Prueba para calificarConductor
    describe('POST /calificarConductor', () => {
        it('should rate a driver successfully', async () => {
            const response = await request(app)
                .post('/calificarConductor')
                .send({
                    viajeID: 1,
                    usuarioID: 1,
                    conductorID: 1,
                    estrellas: 5,
                    comentario: 'Excelente servicio',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Calificación registrada exitosamente.');
        });

        it('should return 400 if the trip has not finished', async () => {
            const response = await request(app)
                .post('/calificarConductor')
                .send({
                    viajeID: 999, // ID de un viaje que no existe
                    usuarioID: 1,
                    conductorID: 1,
                    estrellas: 5,
                    comentario: 'Excelente servicio',
                });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'El viaje no ha terminado.');
        });
    });

    // Prueba para guardarUbicacion
    describe('POST /guardarUbicacion', () => {
        it('should save a location successfully', async () => {
            const response = await request(app)
                .post('/guardarUbicacion')
                .send({
                    UsuarioID: 1,
                    NombreUbicacion: 'Casa',
                    Zona: 'Zona 1',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Ubicación guardada exitosamente.');
        });

        it('should return 500 if an error occurs', async () => {
            const response = await request(app)
                .post('/guardarUbicacion')
                .send({});
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Error al guardar ubicación');
        });
    });

    // Prueba para listarUbicacionesGuardadas
    describe('GET /listarUbicacionesGuardadas/:id', () => {
        it('should list saved locations successfully', async () => {
            const response = await request(app).get('/listarUbicacionesGuardadas/1');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 404 if no locations found', async () => {
            const response = await request(app).get('/listarUbicacionesGuardadas/999'); // ID que no existe
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontraron ubicaciones guardadas.');
        });
    });
});
