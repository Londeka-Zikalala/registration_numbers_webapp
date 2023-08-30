import assert from 'assert';
import regService from '../service/reg_number_service.js'
import db from '../db.js'


describe('The regService tests', function(){
    let registrationService = regService(db)
    beforeEach(async function () {
        try {
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE registrations.towns RESTART IDENTITY CASCADE;");
            await db.none("TRUNCATE TABLE registrations.reg_numbers RESTART IDENTITY CASCADE;");
        } catch (err) {
            console.log(err);
            throw err;
        }
        after(function () {
            db.$pool.end;})

        it('should add a new registration',async function(){
            var reg ={
                regNumber: 'CY 623 428',
                townId: 1
            };
           await  registrationService.addReg(reg)

           var getRegistration = await registrationService.getReg()

           assert.strictEqual(getRegistration.length, 1)
           assert.strictEqual(getRegistration[0].regNumber, 'CY 623 428')
        })
    });

   
})