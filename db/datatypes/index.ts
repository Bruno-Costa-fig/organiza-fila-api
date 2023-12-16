async function createTable (sequelize, DataTypes) {
  const Organization = sequelize.define('Organization', {
    name: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    adminEmail: DataTypes.STRING,
    logoUrl: DataTypes.STRING,
    secondLogoUrl: DataTypes.STRING,
    thirdLogoUrl: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
    limiteBalcoes: DataTypes.INTEGER,
    valid: DataTypes.BOOLEAN,
    uid: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organizationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  await Organization.sync();
  await User.sync();
}

export default createTable;