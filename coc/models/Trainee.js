module.exports = (sequelize, DataTypes) => {
   
    const Trainee = sequelize.define("trainee", {
        traineeid: {
            type: DataTypes.STRING,
        },
        forename: {
            type: DataTypes.STRING,
        },surname: {
            type: DataTypes.STRING,
        },address: {
            type: DataTypes.STRING,
        },place: {
            type: DataTypes.STRING,
        },birthdate: {
            type: DataTypes.STRING,
        },sex: {
            type: DataTypes.STRING,
        },intake_date: {
            type: DataTypes.STRING,
        },phone: {
            type: DataTypes.STRING,
        },mobile: {
            type: DataTypes.STRING,
        },email: {
            type: DataTypes.STRING,
        },experience: {
            type: DataTypes.STRING,
        },talents: {
            type: DataTypes.STRING,
        },income_start: {
            type: DataTypes.DATE,
        },income_start_date: {
            type: DataTypes.DATE,
        },income_end: {
            type: DataTypes.STRING,
        },
        income_end_date: {
    type: DataTypes.DATE,
},income_m1: {
    type: DataTypes.STRING,
},income_m1_date: {
    type: DataTypes.DATE,
},income_m2: {
    type: DataTypes.STRING,
},income_m2_date: {
    type: DataTypes.DATE,
},income_m3: {
    type: DataTypes.STRING,
},income_m3_date: {
    type: DataTypes.DATE,
},general_info: {
    type: DataTypes.STRING,
},health_info: {
    type: DataTypes.STRING,
},behaviour_info: {
    type: DataTypes.STRING,
},visits_info: {
    type: DataTypes.STRING,
},job_info: {
    type: DataTypes.STRING,
},graduated: {
    type: DataTypes.STRING,
},graduated_date: {
    type: DataTypes.DATE,
},dropout: {
    type: DataTypes.STRING,
},dropout_date: {
    type: DataTypes.DATE,
},placed_in_app: {
    type: DataTypes.STRING,
},placed_in_app_date: {
    type: DataTypes.DATE,
},continued_study: {
    type: DataTypes.STRING,
},continued_study_date: {
    type: DataTypes.DATE,
},employed_self: {
    type: DataTypes.STRING,
},employed_self_date: {
    type: DataTypes.DATE,
},employed_six_months: {
    type: DataTypes.STRING,
},
  employed_six_months_date: {
    type: DataTypes.DATE,
},employed_in_fl: {
    type: DataTypes.STRING,
},employed_in_fl_date: {
    type: DataTypes.DATE,
},kbtb_id: {
    type: DataTypes.STRING,
},trade_name: {
    type: DataTypes.STRING,
},batch_name: {
    type: DataTypes.STRING,
},class_name: {
    type: DataTypes.STRING,
},
    });

  
    return Trainee;
}