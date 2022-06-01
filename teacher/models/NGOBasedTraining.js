
module.exports = (sequelize, DataTypes) => {
   
    const NGOBasedTraining = sequelize.define("ngobasedtraining", {
        training_id: {
            type: DataTypes.STRING,
        },
        funder_name: {
            type: DataTypes.STRING,
        },
        funder_id: {
            type: DataTypes.STRING,
        },
        training_name: {
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
  

    return NGOBasedTraining;
}
