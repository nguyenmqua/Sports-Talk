module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.BLOB("long"),
    },
    filepath:{
      type: DataTypes.STRING,
   },
    });

    Image.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Image.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };

  return Image;
};