import assert from 'assert';
import regService from '../service/reg_number_service.js'
import db from '../db.js'


describe('The regService tests', function(){
    this.timeout(6000); 
    let registrationService = regService(db)

    beforeEach(async function () {
        this.timeout(6000); 
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE registrations.towns RESTART IDENTITY CASCADE;");
            await db.none("TRUNCATE TABLE registrations.reg_numbers RESTART IDENTITY CASCADE;");

            //insert the towns
            await db.none("INSERT INTO registrations.towns (town_name) VALUES ('Cape Town'), ('Bellville'), ('Paarl')");
      
      })
      
        
        it('should add registrations',async function(){
           await registrationService.addReg('CA 123-456');
           await registrationService.addReg('CY 653-456');

           let allReg = await registrationService.getReg();
           assert.equal(allReg.length, 2)

        })

        it('should show added registrations',async function(){
            await registrationService.addReg('CA 123-456');
            await registrationService.addReg('CY 653-456');
            let allReg = await registrationService.getReg();
            assert.deepEqual(allReg, [ 
                 {
                   "id": 1,
                    "reg_number": "CA 123-456",
                    "town_id": 1
                 },
                  {
                    "id": 2,
                    "reg_number": "CY 653-456",
                    "town_id": 2
                  }
          ])
         })
 
         it('should show registrations for a specific town',async function(){
            await registrationService.addReg('CA 123-456');
            await registrationService.addReg('CY 653-456');
             await registrationService.getReg();
             let regByTown = await registrationService.getRegByTown('Cape Town')
            assert.deepEqual(regByTown,[
                 {
                   "reg_number": "CA 123-456"
                  }
          ] );
         })
        after(function () {
            db.$pool.end;})

    });

   
