import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Asegúrate de importar el modelo User

dotenv.config();

async function login(req, res) {
  console.log(req.body);
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).send({ status: 'Error', message: 'Los campos están incompletos' });
  }

  try {
    // Busca el usuario en la base de datos
    const usuarioAResvisar = await User.findOne({ where: { user } });

    if (!usuarioAResvisar) {
      return res.status(400).send({ status: 'Error', message: 'Error durante login' });
    }

    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);

    if (!loginCorrecto) {
      return res.status(400).send({ status: 'Error', message: 'Error durante login' });
    }

    // Genera un token JWT
    const token = jsonwebtoken.sign(
      { user: usuarioAResvisar.user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Configura las opciones de la cookie
    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: '/',
    };
    
    // Envia la cookie con el token y la respuesta
    res.cookie('jwt', token, cookieOption);
    res.send({ status: 'ok', message: 'Usuario loggeado', redirect: '/admin' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', message: 'Error en el servidor' });
  }
}

async function register(req, res) {
  const { user, password, email } = req.body;

  if (!user || !password || !email) {
    return res.status(400).send({ status: 'Error', message: 'Los campos están incompletos' });
  }

  try {
    // Verifica si el usuario ya existe
    const usuarioAResvisar = await User.findOne({ where: { user } });

    if (usuarioAResvisar) {
      return res.status(400).send({ status: 'Error', message: 'Este usuario ya existe' });
    }

    // Genera un hash de la contraseña
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Crea un nuevo usuario en la base de datos
    await User.create({ user, email, password: hashPassword });

    return res.status(201).send({ status: 'ok', message: `Usuario ${user} agregado`, redirect: '/' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'Error', message: 'Error en el servidor' });
  }
}

export const methods = {
  login,
  register,
};
