module.exports = (sequelize, DataTypes) => {
   
    const Batch = sequelize.define("batch", {
        batch_id: {
            type: DataTypes.STRING,
        },
        batch_name: {
            type: DataTypes.STRING,
        },
        batch_from: {
            type: DataTypes.DATE,
        },
        batch_to: {
            type: DataTypes.DATE,
        },
        is_current:{
            type: DataTypes.STRING,
        }
       
    });

  
    return Batch;
}