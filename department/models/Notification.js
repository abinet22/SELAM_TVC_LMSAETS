module.exports = (sequelize, DataTypes) => {
   
    const Notification = sequelize.define("notification", {
        note_id: {
            type: DataTypes.STRING,
        },
        notefrom: {
            type: DataTypes.STRING,
        },
        noteto: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.STRING,
        },
        is_read: {
            type: DataTypes.STRING,
        },
       
       
       
    });

  
    return Notification;
}