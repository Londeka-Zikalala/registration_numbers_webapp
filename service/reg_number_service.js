function regService(db){
    //Add a registration number
   async function addReg(registration, townName){
    
    await db.none("INSERT INTO registrations.towns (town_name) VALUES ($1)", townName);
    const town = await db.any('SELECT id FROM registrations.towns WHERE town_name = $1',[townName]);
    let townId = town.id;
    let regNumber = registration;
    await db.none('INSERT INTO registrations.reg_numbers (reg_number, town_id) VALUES ($1, $2)', [regNumber, townId]);
   };

   // get all the registrations

   async function getReg(){
    let allReg = await db.any('SELECT * FROM registrations.reg_numbers');
    return allReg
   }
   return{
    addReg,
    getReg
   }

}

export default regService