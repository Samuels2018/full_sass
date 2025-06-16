'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('plans', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      billing_cycle: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['monthly', 'annual', 'quarterly']]
        }
      },
      features: {
        type: Sequelize.JSONB, // JSONB es más eficiente en PostgreSQL
        allowNull: false,
        defaultValue: []
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Añadir constraint para precio positivo
    await queryInterface.addConstraint('plans', {
      fields: ['price'],
      type: 'check',
      where: {
        price: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'check_positive_price'
    });

    // Función y trigger para actualizar automáticamente updated_at
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_plans_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_update_plans_updated_at
      BEFORE UPDATE ON plans
      FOR EACH ROW
      EXECUTE FUNCTION update_plans_updated_at();
    `);
  },

  async down (queryInterface, Sequelize) {
    // Eliminar el trigger primero
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_plans_updated_at ON plans;
    `);

    // Eliminar la función
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_plans_updated_at();
    `);

    // Finalmente eliminar la tabla
    await queryInterface.dropTable('plans');
  }
};
