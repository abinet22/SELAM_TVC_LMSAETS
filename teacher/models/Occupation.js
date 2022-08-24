module.exports = (sequelize, DataTypes) => {
   
    const Occupation = sequelize.define("occupation", {
        occupation_id: {
            type: DataTypes.STRING,
        },
        occupation_name: {
            type: DataTypes.STRING,
        },
        
        department_id: {
            type: DataTypes.STRING,
        },
        training_cost:{
            type: DataTypes.STRING,
        },
        training_duration:{
            type: DataTypes.STRING,
        }
       
    });

  
    return Occupation;
}