module.exports = (sequelize, DataTypes) => {
   
    const LevelBasedTraining = sequelize.define("levelbasedtraining", {
        training_id: {
            type: DataTypes.STRING,
        },
        training_name: {
            type: DataTypes.STRING,
        },
        training_type: {
            type: DataTypes.STRING,
        },
        training_level: {
            type: DataTypes.STRING,
        },
        isactive: {
            type: DataTypes.STRING,
        },
        training_duration: {
            type: DataTypes.STRING,
        },
        training_cost: {
            type: DataTypes.DECIMAL,
        }

    });

  
    return LevelBasedTraining;
}