
module.exports = (sequelize, DataTypes) => {
   
    const EmployeementHistory = sequelize.define("employementhistory", {
        batch_id: {
            type: DataTypes.STRING,
        },
        trainee_id: {
            type: DataTypes.STRING,
        },
        student_unique_id:{
            type: DataTypes.STRING,
        },
    
        company: {
            type: DataTypes.STRING,
        },
      
        message: {
            type: DataTypes.STRING,
        },
        income_increase:{
            type:DataTypes.DECIMAL,
        },
        update_type:{
            type: DataTypes.STRING,
        }
   
    });
  

    return EmployeementHistory;
}
