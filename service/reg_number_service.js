function regService(db){

    //Add a registration number
   async function addReg(registration){
    
        const RegExp = /^([A-Z]{2}\s?\d{3}-\d{3})$|^([A-Z]{2}\s?\d{4})$|^([A-Z]{2}\s?\d{7})$|^([A-Z]{2}\s?\d{3}\s\d{3})$|^([A-Z]{2}\s?\d{3})$/i;
        
    if(registration.length <= 10 && RegExp.test(registration)){
        let regNumber = registration;
        await db.none('INSERT INTO registrations.reg_numbers (reg_number) VALUES ($1)', [regNumber]);
      
    }
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