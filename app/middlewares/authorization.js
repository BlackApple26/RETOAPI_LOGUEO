import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function soloAdmin(req, res, next) {
  const logueado = await revisarCookie(req);
  if (logueado) return next();
  return res.redirect("/");
}

async function soloPublico(req, res, next) {
  const logueado = await revisarCookie(req);
  if (!logueado) return next();
  return res.redirect("/admin");
}

async function revisarCookie(req) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      console.log('No se encontraron cookies');
      return false;
    }

    const cookieJWT = cookies.split("; ").find(cookie => cookie.startsWith("jwt="));
    if (!cookieJWT) {
      console.log('No se encontró la cookie JWT');
      return false;
    }

    const token = cookieJWT.slice(4);
    if (!token) {
      console.log('Token vacío');
      return false;
    }

    const decodificada = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decodificada);

    if (!decodificada || !decodificada.user) {
      console.log('Token inválido o sin usuario');
      return false;
    }

    const usuarioARevisar = await User.findOne({ where: { user: decodificada.user } });
    console.log('Usuario encontrado:', usuarioARevisar);

    if (!usuarioARevisar) {
      console.log('Usuario no encontrado en la base de datos');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al revisar la cookie:', error);
    return false;
  }
}

export const methods = {
  soloAdmin,
  soloPublico,
};