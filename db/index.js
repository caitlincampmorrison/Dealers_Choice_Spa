const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/flowershop_db')
const { STRING, INTEGER, UUID, UUIDV4 } = Sequelize.DataTypes;

const flower_name = ['roses', 'tulips', 'daisies', 'lily']
const colorval = ['red', 'pink', 'yellow', 'white']
const cust_name = ['joe', 'jill', 'mike', 'paul']

const Customer = db.define('customer', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

const Flower = db.define('flower', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: STRING(20)
    },
    color: {
        type: STRING(20)
    }
})

const Sale = db.define('sale',{
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    flowerId: {
        type: UUID,
        allowNull: false
    },
    customerId: {
        type: UUID,
        allowNull: false
    }
})

const syncAndSeed = async() => {
    await db.sync({ force: true })
    const [roses, tulips, daisies, lily] = await Promise.all(
        flower_name.map((name, idx) => 
           Flower.create({ name, color: colorval[idx] }),
        )
    )
    const [joe, jill, mike, paul] = await Promise.all(
        cust_name.map(name => 
           Customer.create({ name, flowerId: roses.id })
        )
    )
    await Promise.all([
        Sale.create({flowerId: roses.id, customerId: joe.id}),
        Sale.create({flowerId: tulips.id, customerId: jill.id}),
        Sale.create({flowerId: daisies.id, customerId: mike.id}),
        Sale.create({flowerId: lily.id, customerId: paul.id})
    ])
}

Sale.belongsTo(Customer)
Sale.belongsTo(Flower)

module.exports = {
    syncAndSeed,
    models: {
      Sale,
      Customer,
      Flower
    }
  };