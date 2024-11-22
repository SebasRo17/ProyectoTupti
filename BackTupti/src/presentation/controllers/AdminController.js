const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../domain/models/User');
const Rol = require('../../domain/models/Rol');

const loginAdmin = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { Email: email } });// Buscar al usuario por email
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(password, user.Contrasenia);// Verificar la contraseña
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const rol = await Rol.findOne({ where: { IdRol: user.IdRol } });// Verificar si el usuario es administrador
        if (rol.Detalle !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const token = jwt.sign({ id: user.IdUsuario, role: rol.Detalle }, 'secretKey', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

module.exports = {loginAdmin};