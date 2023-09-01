import assert from 'assert';
import regService from '../service/reg_number_service.js'
import db from '../db.js'


describe('The regService tests', function(){
    this.timeout(4000); 
    let registrationService = regService(db)

    beforeEach(async function () {
        this.timeout(4000); 
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE registrations.towns RESTART IDENTITY CASCADE;");
            await db.none("TRUNCATE TABLE registrations.reg_numbers RESTART IDENTITY CASCADE;");
      
      })
      
        
        it('should add a new registration',async function(){
            const regNumber = 'CY 623 428';

            await registrationService.addReg(regNumber);
           var getRegistration = await registrationService.getReg()

           assert.equal(getRegistration.length, 1)
           assert.equal(getRegistration[0].reg_number, 'CY 623 428')
        })

        after(function () {
            db.$pool.end;})

    });

   
