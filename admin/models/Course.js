module.exports = (sequelize, DataTypes) => {
   
    const Course = sequelize.define("course", {
        course_id: {
            type: DataTypes.STRING,
        },
        course_name: {
            type: DataTypes.STRING,
        },
        course_code: {
            type: DataTypes.STRING,
        },
        department_id: {
            type: DataTypes.STRING,
        },
        department_name: {
            type: DataTypes.STRING,
        },
        training_hours:{
            type: DataTypes.STRING,
        },
        training_cost:{
            type: DataTypes.DECIMAL,
        },
        training_level:{
            type: DataTypes.STRING,
        },
        semister:{
            type: DataTypes.STRING,
        },
        nooflo:{
            type: DataTypes.DECIMAL
        },
      
        learning_obj:{
            type:DataTypes.JSON
        },
      

       
    
    });

  
    return Course;
}