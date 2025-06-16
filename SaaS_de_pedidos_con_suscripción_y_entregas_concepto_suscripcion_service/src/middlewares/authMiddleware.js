'use strict'

require('dotenv').config();
const jwt = require('jsonwebtoken')
const { Sequelize } = require('sequelize')

const authToken = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: false,
    underscored: true,
  }
})

const authMiddleware = async (req, res, next) => {
  console.log('Middleware de autenticación ejecutado')
  // Obtener el token del encabezado de autorización
  const token = req.header('Authorization')?.replace('Bearer ', '')
    
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' })
  }

  // Verificar el token
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  console.log('Decoded token:', decoded)

  const user = await authToken.query(
    'SELECT * FROM custom_auth_useraccount WHERE user_id = :user_id',
    {
      replacements: { user_id: String(decoded.user_id) }, // Convertir a string explícitamente
      type: Sequelize.QueryTypes.SELECT
    }
  )

  /*if (!user || user.length === 0) {
    return res.status(403).json({ error: 'Usuario no encontrado' })
  }*/
  
  // Añadir el usuario al request
  req.user = decoded.user_id;
  next();
}

module.exports = {
  authMiddleware
}