
module.exports = (sequelize, DataTypes) => {
   
    const NGOBasedTrainee = sequelize.define("ngobasedtrainee", {
        batch_id: {
            type: DataTypes.STRING,
        },
        applicant_id: {
            type: DataTypes.STRING,
        },
        applicant_photo: {
            type: DataTypes.BLOB("long"),
        },
        photo_type: {
            type: DataTypes.STRING,
        },
        photo_name: {
            type: DataTypes.STRING,
        },
        trainee_id: {
            type: DataTypes.STRING,
        },
        student_unique_id: {
            type: DataTypes.STRING,
        },
        personal_info: {
            type: DataTypes.JSON,
        },
        contact_info: {
            type: DataTypes.JSON,
        },
        grade9_trans: {
            type: DataTypes.JSON,
        },
        grade10_trans: {
            type: DataTypes.JSON,
        },
        grade11_trans: {
            type: DataTypes.JSON,
        },
        grade12_trans: {
            type: DataTypes.JSON,
        },
        grade9_ave: {
            type: DataTypes.DECIMAL,
        },
        grade10_ave: {
            type: DataTypes.DECIMAL,
        },
        grade11_ave: {
            type: DataTypes.DECIMAL,
        },
        grade12_ave: {
            type: DataTypes.DECIMAL,
        },
        grade10_leaving: {
            type: DataTypes.DECIMAL,
        },
        grade12_leaving: {
            type: DataTypes.DECIMAL,
        },
        apptitude_result: {
            type: DataTypes.DECIMAL,
        },
        department_id: {
            type: DataTypes.STRING,
        },
        admission_type: {
            type: DataTypes.STRING,
        },
        class_id: {
            type: DataTypes.STRING,
        },
        entry_level: {
            type: DataTypes.STRING,
        },
        current_level: {
            type: DataTypes.STRING,
        },
        entry_semister: {
            type: DataTypes.STRING,
        },
        current_semister: {
            type: DataTypes.STRING,
        },
        is_disable: {
            type: DataTypes.STRING,
        },
        is_graduated:{
            type: DataTypes.STRING,
        },
        is_dropout:{
            type: DataTypes.STRING,
        },
        countinue_study:{
            type: DataTypes.STRING,
        },
        payment_info: {
            type: DataTypes.STRING,
        },
        is_pass_coc :{
            type:DataTypes.STRING,
        },
        is_send_to_jbs:{
            type:DataTypes.STRING,
        }
        
               
    });
  

    return NGOBasedTrainee;
}
