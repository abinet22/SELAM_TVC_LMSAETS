module.exports = (sequelize, DataTypes) => {
   
    const Company = sequelize.define("company", {
        company_id: {
            type: DataTypes.STRING,
        },
        company_name: {
            type: DataTypes.STRING,
        },
        business_category: {
            type: DataTypes.STRING,
        },
        contact_person_jbs: {
            type: DataTypes.STRING,
        },
        number_of_employee: {
            type: DataTypes.STRING,
        },
        region:{
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
        contact_person_phone: {
            type: DataTypes.STRING,
        },
        office_phone:{
            type: DataTypes.STRING,
        },
        general_info:{
            type: DataTypes.STRING,
        },
        postal_code:{

            type: DataTypes.STRING,
        },
        email:{
            type: DataTypes.STRING,
        },
        website:{
            type: DataTypes.STRING,
        },
        visiting_info:{
            type: DataTypes.STRING,
        },
        placement_info:{
            type: DataTypes.STRING,
        },
        is_fair_labour_condition:{
            type: DataTypes.STRING,
        },
        fair_labour_score:{
            type: DataTypes.STRING,
        }




    });

  
    return Company;
}