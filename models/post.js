module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1]
      }
    });
  
    Post.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        },
        onDelete:"cascade"
      });
      Post.hasMany(models.Comment, {
        onDelete: "cascade"
      });
    };
  
    return Post;
  };
  