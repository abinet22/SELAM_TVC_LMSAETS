module.exports = (sequelize, DataTypes) => {
   
    const IndustryBasedTraining = sequelize.define("industrybasedtraining", {
        training_id: {
            type: DataTypes.STRING,
        },
        company_name: {
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

  
    return IndustryBasedTraining;
}