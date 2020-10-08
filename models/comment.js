module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define("Comment", {
      body: {
        type: DataTypes.TEXT,
        len: [1]
      }
    });
  
    Comment.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
        },
        onDelete: "cascade"
      });
      Comment.belongsTo(models.User,{
        foreignKey: {
          allowNull: false
        },
        onDelete: "cascade"
      })
    };
  
    return Comment;
  };
  