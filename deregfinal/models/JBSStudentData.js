
module.exports = (sequelize, DataTypes) => {
   
    const JBSStudentData = sequelize.define("jbsstudentdata", {
        batch_id: {
            type: DataTypes.STRING,
        },
        trainee_id: {
            type: DataTypes.STRING,
        },
        student_unique_id:{
            type: DataTypes.STRING,
        },
        full_name: {
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
        birthdate: {
            type: DataTypes.DATE,
        },
        sex: {
            type: DataTypes.STRING,
        },
        age:{ 
            type: DataTypes.DECIMAL,
        },
        intake_date: {
            type: DataTypes.DATE,
        },
        personal_phone: {
            type: DataTypes.STRING,
        },
        family_phone: {
            type: DataTypes.STRING,
        },
        family_name: {
            type: DataTypes.STRING,
        },
        experience: {
            type: DataTypes.STRING,
        },
        talents: {
            type: DataTypes.STRING,
        },
        income_start: {
            type: DataTypes.STRING,
        },
        income_start_date: {
            type: DataTypes.DATE,
        },
        income_end: {
            type: DataTypes.STRING,
        },
        income_end_date: {
            type: DataTypes.DATE,
        },
        income_m1: {
            type: DataTypes.STRING,
        },
        income_m1_date: {
            type: DataTypes.DATE,
        },
        income_m2: {
            type: DataTypes.STRING,
        },
        income_m2_date: {
            type: DataTypes.DATE,
        },
        income_m3: {
            type: DataTypes.STRING,
        },
        income_m3_date: {
            type: DataTypes.DATE,
        },
        general_info: {
            type: DataTypes.STRING,
        },
        health_info: {
            type: DataTypes.STRING,
        },
        behaviour_info: {
            type: DataTypes.STRING,
        },
        visits_info: {
            type: DataTypes.STRING,
        },
        job_info: {
            type: DataTypes.STRING,
        },
        graduated: {
            type: DataTypes.STRING,
        },
        graduated_date: {
            type: DataTypes.DATE,
        },
      
        placed_in_app: {
            type: DataTypes.STRING,
        },
        placed_in_app_date: {
            type: DataTypes.DATE,
        },
        continued_study: {
            type: DataTypes.STRING,
        },
        continued_study_date: {
            type: DataTypes.DATE,
        },
        employed_self: {
            type: DataTypes.STRING,
        },
        employed_self_date: {
            type: DataTypes.DATE,
        },
        employed_six_months: {
            type: DataTypes.STRING,
        },
        employed_six_months_date: {
            type: DataTypes.DATE,
        },
        employed_in_fl: {
            type: DataTypes.STRING,
        },
        employed_in_fl_date: {
            type: DataTypes.DATE,
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
     
        is_disable: {
            type: DataTypes.STRING,
        },
       
        payment_info: {
            type: DataTypes.STRING,
        },
        programtag: {
            type: DataTypes.STRING,
        },
   
    });
  

    return JBSStudentData;
}
