
module.exports = (sequelize, DataTypes) => {
   
    const NewApplicant = sequelize.define("newapplicant", {
        application_id: {
            type: DataTypes.STRING,
        },
        applicant_id: {
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
        is_selected: {
            type: DataTypes.STRING,
        },
        selected_department: {
            type: DataTypes.STRING,
        },
        selected_class: {
            type: DataTypes.STRING,
        },
        choice_one: {
            type: DataTypes.STRING,
        },
        choice_two: {
            type: DataTypes.STRING,
        },
        choice_three: {
            type: DataTypes.STRING,
        },
        choice_level: {
            type: DataTypes.STRING,
        },
        choice_program_type: {
            type: DataTypes.STRING,
        },
        is_disable: {
            type: DataTypes.STRING,
        },
        payment_info: {
            type: DataTypes.STRING,
        },
    });
  

    return NewApplicant;
}
