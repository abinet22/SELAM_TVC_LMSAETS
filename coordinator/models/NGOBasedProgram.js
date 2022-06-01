module.exports = (sequelize, DataTypes) => {
   
    const NGOBasedProgram = sequelize.define("ngobasedprogram", {
        program_id: {
            type: DataTypes.STRING,
        },
        program_created_by: {
            type: DataTypes.STRING,
        },
        program_description: {
            type: DataTypes.STRING,
        },
        funder_id:{
            type: DataTypes.STRING,
        },
        training_types: {
            type: DataTypes.JSON,
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
        minimum_criteria: {
            type: DataTypes.STRING,
        },
        selection_criteria: {
            type: DataTypes.JSON,
        },
        is_open: {
            type: DataTypes.STRING,
        }
        
       
    });

  
    return NGOBasedProgram;
}

 