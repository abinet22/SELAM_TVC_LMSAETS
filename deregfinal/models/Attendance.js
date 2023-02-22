module.exports = (sequelize, DataTypes) => {
   
    const Attendance = sequelize.define("attendance", {
        batch_id: {
            type: DataTypes.STRING,
        },
      
        class_id: {
            type: DataTypes.STRING,
        },
        student_id:{
            type: DataTypes.STRING,
        },
        attendance_type:{
            type: DataTypes.STRING,
        },
        attendance_date:{
            type: DataTypes.STRING,
        },
        uoc_name:{
            type: DataTypes.STRING,
        }
       
    });

  
    return Attendance;
}