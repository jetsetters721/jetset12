import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance using MySQL
const sequelize = new Sequelize(
  process.env.DB_DATABASE,    // Database name
  process.env.DB_USERNAME,    // Database user
  process.env.DB_PASSWORD,    // User password
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    define: {
      freezeTableName: true,  // Prevent Sequelize from pluralizing table names
      timestamps: false       // Disable automatic timestamps (createdAt, updatedAt)
    },
    dialectOptions: {
      // optional - enable if using SSL or custom charset
      charset: 'utf8mb4',
      ssl: process.env.DB_SSL === 'true'
    }
  }
);

// Test MySQL connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.*****************');
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error);
  }
})();

export default sequelize;
