module.exports = (sequelize, DataTypes) => {
   
    const StaffList = sequelize.define("stafflist", {
        staff_id: {
            type: DataTypes.STRING,
        },
        staff_f_name: {
            type: DataTypes.STRING,
        },
        staff_m_name: {
            type: DataTypes.STRING,
        },
        staff_l_name: {
            type: DataTypes.STRING,
        },
        region: {
            type: DataTypes.STRING,
        },
        woreda: {
            type: DataTypes.STRING,
        },
        zone: {
            type: DataTypes.STRING,
        },
        hno: {
            type: DataTypes.STRING,
        },
        mobileno: {
            type: DataTypes.STRING,
        },
        photo_name:{
            type: DataTypes.STRING,
        },
        photo_type:{

            type: DataTypes.STRING,
        },
        photo_data:{
            type: DataTypes.BLOB("long"),
        },
        isteacher:{
            type: DataTypes.STRING,
        },
        staff_collage_id:{
            type: DataTypes.STRING,
        }


    });

  
    return StaffList;
}