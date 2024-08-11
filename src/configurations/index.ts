export default () => ({
  port: process.env.PORT,
  db_port: process.env.DB_PORT,
  db_host: process.env.DB_HOST,
  db_user: process.env.DB_LOGIN,
  db_password: process.env.DB_PASSWORD,
  db_database: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  EXPIRE_JWT: process.env.EXPIRE_JWT,
});
