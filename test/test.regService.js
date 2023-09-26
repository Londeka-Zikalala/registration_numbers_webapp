import assert from 'assert';
import regService from '../service/reg_number_service.js'
import db from '../db.js'


describe('The regService tests',  function(){
    this.timeout(6000); 
   

    beforeEach(async function () {
       // this.timeout(6000); 
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE towns RESTART IDENTITY CASCADE;");
            await db.none("TRUNCATE TABLE reg_numbers RESTART IDENTITY CASCADE;");

            //insert the towns
            await db.none("INSERT INTO towns (town_name) VALUES ('Cape Town'), ('Bellville'), ('Paarl')");
      
      })

      it('should transform registration numbers correctly', async function() {
        let registrationService =  regService(db);
        let transformed = await registrationService.transformReg('CA 123-456');
        assert.equal(transformed, 'CA123456');
    });

    
    it('should reset the registrations', async function() {
        let registrationService = regService(db);
        await registrationService.addReg('CA 123-456');
        await registrationService.reset();
        let allReg = await registrationService.getReg();
        assert.equal(allReg.length, 0);
    });
    
    it('should throw an error when adding a duplicate registration', async function() {
        let registrationService =regService(db);
        await registrationService.addReg('CA 123-456');
        try {
            await registrationService.addReg('CA 123-456');
            assert.fail('Expected error not thrown');
        } catch (error) {
            assert.equal(error.message, 'Registration already exists');
        }
    });
    
        
        it('should add registrations',async function(){
          let registrationService = regService(db)
            
           await registrationService.addReg('CA 123-456');
           await registrationService.addReg('CY 653-456');
          
           let allReg = await registrationService.getReg();
           assert.equal(allReg.length, 2)

        })

        it('should show added registrations',async function(){
          let registrationService = regService(db)
            await registrationService.addReg('CA 123-456');
            await registrationService.addReg('CY 653-456');
            let allReg = await registrationService.getReg();
            assert.deepEqual(allReg, [ 
                 {
                   "id": 1,
                    "reg_number": "CA123456",
                    "town_id": 1
                 },
                  {
                    "id": 2,
                    "reg_number": "CY653456",
                    "town_id": 2
                  }
          ])
         })
 
         it('should show registrations for a specific town',async function(){
          let registrationService = regService(db)
            await registrationService.addReg('CA 123-456');
            await registrationService.addReg('CY 653-456');
             await registrationService.getReg();
             let regByTown = await registrationService.getRegByTown('Cape Town')

            assert.deepEqual(regByTown,[
                 {
                   "reg_number": "CA123456"
                  }
          ] );
         })
         
        after(function () {
            db.$pool.end();})

    });

   
