module.exports = (sequelize, DataTypes) => {
   
    const IndustryBasedProgram = sequelize.define("industrybasedprogram", {
        program_id: {
            type: DataTypes.STRING,
        },
        program_created_by: {
            type: DataTypes.STRING,
        },
        program_description: {
            type: DataTypes.STRING,
        },
        company_name:{
            type: DataTypes.STRING,
        },
        batch_id: {
            type: DataTypes.STRING,
        },
        training_names: {
            type: DataTypes.JSON,
        },
        app_start_date: {
            type: DataTypes.DATE,
        },
        app_end_date: {
            type: DataTypes.DATE,
        },
        training_start_date: {
            type: DataTypes.DATE,
        },
        training_end_date: {
            type: DataTypes.DATE,
        },
     
        is_open: {
            type: DataTypes.STRING,
        },
        is_confirm:{
            type: DataTypes.STRING,
        }
       
    });

  
    return IndustryBasedProgram;
}

 