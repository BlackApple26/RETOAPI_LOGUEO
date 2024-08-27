import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Importa el modelo User

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
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt="))?.slice(4);
    
    if (!cookieJWT) return false;
    
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificada);

    // Busca el usuario en la base de datos
    const usuarioAResvisar = await User.findOne({ where: { user: decodificada.user } });
    console.log(usuarioAResvisar);

    if (!usuarioAResvisar) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const methods = {
  soloAdmin,
  soloPublico,
};
