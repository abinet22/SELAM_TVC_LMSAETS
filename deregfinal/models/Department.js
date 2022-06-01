module.exports = (sequelize, DataTypes) => {
   
    const Department = sequelize.define("department", {
        department_id: {
            type: DataTypes.STRING,
        },
        department_name: {
            type: DataTypes.STRING,
        },
        training_name: {
            type: DataTypes.STRING,
        },
        training_id: {
            type: DataTypes.STRING,
        }
       
    });

  
    return Department;
}