module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define("Profile", {
        interest: {
        type: DataTypes.TEXT,  
        },
        relationship: {
        type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.TEXT,
            }
      });

      Profile.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Profile.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
  
    return Profile;
  };