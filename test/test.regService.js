import assert from 'assert';
import regService from '../service/reg_number_service.js'
import db from '../db.js'


describe('The regService tests', function(){
    this.timeout(6000); 
    let registrationService = regService(db)

    beforeEach(async function () {
        this.timeout(5000); 
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE registrations.towns RESTART IDENTITY CASCADE;");
            await db.none("TRUNCATE TABLE registrations.reg_numbers RESTART IDENTITY CASCADE;");
        //Insert a town
        await db.none("INSERT INTO registrations.towns (town_name) VALUES ('Johannesburg');");
         
      })
      
        
        it('should add a new registration',async function(){
            var reg ={
            regNumber: 'CY 623 428',
                townId: 1
            };
           await  registrationService.addReg(reg)

           var getRegistration = await registrationService.getReg()

           assert.equal(getRegistration.length, 1)
           assert.equal(getRegistration[0].reg_number, 'CY 623 428')
        })

        after(function () {
            db.$pool.end;})

    });

   
