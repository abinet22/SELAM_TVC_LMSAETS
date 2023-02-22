
module.exports = (sequelize, DataTypes) => {
   
    const TraineeCOCHistory = sequelize.define("traineecochistory", {
        batch_id: {
            type: DataTypes.STRING,
        },
        trainee_id: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.STRING,
        },
      
    });
  

    return TraineeCOCHistory;
}
