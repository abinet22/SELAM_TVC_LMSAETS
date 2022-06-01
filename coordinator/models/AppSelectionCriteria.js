module.exports = (sequelize, DataTypes) => {
   
    const AppSelectionCriteria = sequelize.define("appselectioncriteria", {
        criteria_id: {
            type: DataTypes.STRING,
        },
        criteria_name: {
            type: DataTypes.STRING,
        },
        criteria_status: {
            type: DataTypes.STRING,
        }
       
    });

  
    return AppSelectionCriteria;
}