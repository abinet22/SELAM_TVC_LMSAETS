module.exports = (sequelize, DataTypes) => {
   
    const LevelBasedProgram = sequelize.define("levelbasedprogram", {
        program_id: {
            type: DataTypes.STRING,
        },
        program_created_by: {
            type: DataTypes.STRING,
        },
        program_description: {
            type: DataTypes.STRING,
        },
        training_levels: {
            type: DataTypes.JSON,
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
        },
        is_confirm:{
            type: DataTypes.STRING,
        }
       
        
       
    });

  
    return LevelBasedProgram;
}

 