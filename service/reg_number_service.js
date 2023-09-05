function regService(db){

    //Add a registration number
    async function addReg(registration){
        const RegExp = /^([A-Z]{2}\s?\d{3}-\d{3})$|^([A-Z]{2}\s?\d{4})$|^([A-Z]{2}\s?\d{7})$|^([A-Z]{2}\s?\d{3}\s\d{3})$|^([A-Z]{2}\s?\d{3})$/i;
        
        if(registration.length <= 10 && RegExp.test(registration)){
            let regNumber = registration;
            let townId
            
            await db.none('INSERT INTO registrations.reg_numbers (reg_number) VALUES ($1)', [regNumber]);
           
          
        }
    };

   // get all the registrations
   async function getTownId(){
        let townName
    await db.none("INSERT INTO registrations.towns (town_name) VALUES ('Cape Town'), ('Bellville'), ('Paarl')");
    const town = await db.one('SELECT id FROM registrations.towns WHERE town_name = $1', [townName]);
    if(regNumber.startsWith('CA')){
        town = 1;
    } else if(regNumber.startsWith('CY')){
        town = 2;
    } else if(regNumber.startsWith('CB')){
        town = 3;
    }
    
    return town
   }

   async function getReg(){
    let allReg = await db.any('SELECT * FROM registrations.reg_numbers');
    return allReg
   }

   async function getRegByTown(townName) {

    let regByTown = await db.any('SELECT reg_number FROM registrations.reg_numbers JOIN registrations.towns ON reg_numbers.town_id = towns.id WHERE towns.town_name = $1', [townName]);
    return regByTown;
}
   return{
    addReg,
    getTownId,
    getReg,
    getRegByTown
   }

}

export default regService