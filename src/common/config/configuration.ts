export default () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        isProduction: isProduction,
        isAuthEnabled: process.env.AUTH_ENABLED === 'true',
        version: process.env.npm_package_version,
        port: parseInt(process.env.PORT) || 4000,
        jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
        jwtSecretExpires: process.env.JWT_SECRET_EXPIRES || '7d',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret',
        jwtRefreshSecretExpires: process.env.JWT_REFRESH_SECRET_EXPIRES || '30d',
    }
}