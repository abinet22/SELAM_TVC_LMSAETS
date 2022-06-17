module.exports = (sequelize, DataTypes) => {
   
    const User = sequelize.define("user", {
        userid: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        userroll: {
            type: DataTypes.STRING,
        },
        isactive: {
            type: DataTypes.STRING,
        },
        fullname: {
            type: DataTypes.STRING,
        },
        department: {
            type: DataTypes.STRING,
        }

    });

  
    return User;
}