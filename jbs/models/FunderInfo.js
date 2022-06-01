
module.exports = (sequelize, DataTypes) => {
   
    const FunderInfo = sequelize.define("funderinfo", {
        funder_id: {
            type: DataTypes.STRING,
        },
        funder_name: {
            type: DataTypes.STRING,
        },
        funder_address: {
            type: DataTypes.STRING,
        },
        funder_phone: {
            type: DataTypes.STRING,
        },
        funder_contact_name: {
            type: DataTypes.STRING,
        },
        funder_contact_phone: {
            type: DataTypes.STRING,
        },
        funder_email: {
            type: DataTypes.STRING,
        },
        funder_website: {
            type: DataTypes.STRING,
        }

    });

  
    return FunderInfo;
}