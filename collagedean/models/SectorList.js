module.exports = (sequelize, DataTypes) => {
   
    const SectorList = sequelize.define("sectorlist", {
        sector_id: {
            type: DataTypes.STRING,
        },
        sector_name: {
            type: DataTypes.STRING,
        }
        
    
       
    });

  
    return SectorList;
}