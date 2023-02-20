module.exports = (sequelize, DataTypes) => {
   
    const ClassInDept = sequelize.define("classindept", {
        batch_id: {
            type: DataTypes.STRING,
        },
        class_name: {
            type: DataTypes.STRING,
        },
        department_id: {
            type: DataTypes.STRING,
        },
        training_level: {
            type: DataTypes.STRING,
        },
        training_type: {
            type: DataTypes.STRING,
        },
        class_id: {
            type: DataTypes.STRING,
        }
       
    });

  
    return ClassInDept;
}