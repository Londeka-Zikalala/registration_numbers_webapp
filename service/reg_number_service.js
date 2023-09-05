function regService(db){

    //Add a registration number
 async function addReg(registration){
    const RegExp = /^([A-Z]{2}\s?\d{3}-\d{3})$|^([A-Z]{2}\s?\d{4})$|^([A-Z]{2}\s?\d{7})$|^([A-Z]{2}\s?\d{3}\s\d{3})$|^([A-Z]{2}\s?\d{3})$/i;
    
    if(registration.length <= 10 && RegExp.test(registration)){
        let regNumber = registration;
        let townName;
        
        if(regNumber.startsWith('CA')){
            townName = 'Cape Town';
        } else if(regNumber.startsWith('CY')){
            townName = 'Bellville';
        } else if(regNumber.startsWith('CB')){
            townName = 'Paarl';
        }
        
        let town = await db.oneOrNone('SELECT id FROM registrations.towns WHERE town_name = $1', [townName]);
        
        await db.none('INSERT INTO registrations.reg_numbers (reg_number, town_id) VALUES ($1, $2)', [regNumber, town.id]);
    }
}

   // get all the registrations
  

   async function getReg(){
    let allReg = await db.any('SELECT * FROM registrations.reg_numbers');
    return allReg
   }
//filter registrations by town id
   async function getRegByTown(townName) {

    let regByTown = await db.any('SELECT reg_number FROM registrations.reg_numbers JOIN registrations.towns ON reg_numbers.town_id = towns.id WHERE towns.town_name = $1', [townName]);
    return regByTown;
}
   return{
    addReg,
    getReg,
    getRegByTown
   }

}

export default regService