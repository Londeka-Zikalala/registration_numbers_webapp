function regService(db){

    //Add a registration number
    async function addReg(registration) {
        if (registration.length > 4 || registration.length <= 10) {
            let regNumber = registration.toUpperCase();

            // Check if the registration number already exists in the database
            const regExists = await db.oneOrNone('SELECT * FROM registrations.reg_numbers WHERE reg_number = $1', [regNumber]);
            if (!regExists) {
            let townName;
    
            if (regNumber.replace(/[^A-Z0-9]/gi, '').startsWith('CA')) {
                townName = 'Cape Town';
            } else if (regNumber.replace(/[^A-Z0-9]/gi, '').startsWith('CY')){
                townName = 'Bellville';
            } else if (regNumber.replace(/[^A-Z0-9]/gi, '').startsWith('CB')) {
                townName = 'Paarl';
            }
    
            let town = await db.oneOrNone('SELECT id FROM registrations.towns WHERE town_name = $1', [townName]);
    
            await db.none('INSERT INTO registrations.reg_numbers (reg_number, town_id) VALUES ($1, $2)', [regNumber, town.id]);
        }
    }
    }
    

   // get all the registrations
  

   async function getReg(){
    let allReg = await db.any('SELECT * FROM registrations.reg_numbers;');
    return allReg
   }
//filter registrations by town id
   async function getRegByTown(townName) {

    let regByTown = await db.any('SELECT reg_number FROM registrations.reg_numbers JOIN registrations.towns ON reg_numbers.town_id = towns.id WHERE towns.town_name = $1', [townName]);
    if(townName === "Paarl"|| townName === "Bellville" || townName === "Cape Town"){
        return regByTown
    } else {
        
        return getReg()
    }
}

async function reset(){
    await db.none("TRUNCATE TABLE registrations.reg_numbers RESTART IDENTITY CASCADE;");
}
   return{
    addReg,
    getReg,
    getRegByTown,
    reset
   }

}

export default regService