function regService(db){
    //transform input registration 
    async function transformReg(registration){
        var RegExp = /^([A-Z]{2}\s?\d{3}-\d{3})$|^([A-Z]{2}\s?\d{4})$|^([A-Z]{2}\s?\d{7})$|^([A-Z]{2}\s?\d{3}\s\d{3})$|^([A-Z]{2}\s?\d{3})$|^([A-Z]{2}\s?\d{6})$|^([A-Z]{2}\s?\d{8})$|^([A-Z]{2}\s\d{8})$/i;
        //remove spaces
        RegExp.test(registration);
        let transformed =  registration.replace(/-/g, '');
        //remove the hyphens
        transformed = transformed.replace(/\s/g, '');

        return transformed
    }

    //Add a registration number
    async function addReg(registration) {
        let transformed = await transformReg(registration);
        if (transformed.length > 4 || transformed.length <= 10) {
            let regNumber = transformed.toUpperCase()

            // Check if the registration number already exists in the database
            const regExists = await db.oneOrNone('SELECT * FROM reg_numbers WHERE reg_number = $1', [regNumber]);
            if (regExists) {
               
                throw new Error('Registration already exists')
            } else{
        
            let townName;
    
            if (regNumber.startsWith('CA')) {
                townName = 'Cape Town';
            } else if (regNumber.startsWith('CY')){
                townName = 'Bellville';
            } else if (regNumber.startsWith('CB')) {
                townName = 'Paarl';
            }
    
            let town = await db.oneOrNone('SELECT id FROM towns WHERE town_name = $1', [townName]);
    
            await db.none('INSERT INTO reg_numbers (reg_number, town_id) VALUES ($1, $2)', [regNumber, town.id]);
        }
    }
    }
    

   // get all the registrations


   async function getReg(){
    let allReg = await db.any('SELECT * FROM reg_numbers;');
    return allReg
   }
//filter registrations by town id
   async function getRegByTown(townName) {

    let regByTown = await db.any('SELECT reg_number FROM reg_numbers JOIN towns ON reg_numbers.town_id = towns.id WHERE towns.town_name = $1', [townName]);
    if(townName === "Paarl"|| townName === "Bellville" || townName === "Cape Town"){
        return regByTown
    } else {
        
        return getReg()
    }
}

async function reset(){
    await db.none("TRUNCATE TABLE reg_numbers RESTART IDENTITY CASCADE;");
}
   return{
    transformReg,
    addReg,
    getReg,
    getRegByTown,
    reset
   }

}

export default regService