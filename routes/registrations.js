// routes.js
import express from 'express';
import regService from '../service/reg_number_service.js';
import db from '../db.js';

const router = express.Router();
const regRoute = regService(db);

router.get('/', async (req, res) => {
    try {
        let getRegistrations = await regRoute.getReg();
        res.render('index', {
            getRegistrations,
             messages: req.flash() 
        });
   
    } catch (error) {
        // Handle errors
        console.error('Error fetching registrations', error);
        req.flash('error', 'Error adding registration');
        res.redirect('/');
    }
});

router.post('/reg_number', async (req, res) => {
    const regNumber = req.body.regNumber;
    const RegExp = /^([A-Z]{2}\s?\d{3}-\d{3})$|^([A-Z]{2}\s?\d{4})$|^([A-Z]{2}\s?\d{7})$|^([A-Z]{2}\s?\d{3}\s\d{3})$|^([A-Z]{2}\s?\d{3})$|^([A-Z]{2}\s?\d{6})$|^([A-Z]{2}\s?\d{8})$|^([A-Z]{2}\s\d{8})$/i;
    const testedReg = RegExp.test(regNumber)

    if (!testedReg) {
        req.flash('error', 'Please enter a valid registration number');
        res.redirect('/');
        return;
    }

    try {
        // Call the registration service to add the registration
        await regRoute.addReg(regNumber);
        
        // Redirect to the registration list after adding
        res.redirect('/');
    } catch (error) {
        // Handle errors
        console.error('Error adding registration', error);
        res.status(500).send('Please enter valid registration');
    }
});

router.get('/reg_number', async (req, res) => {
    try {
        let getRegistrations = await regRoute.getReg();
        res.render('index', {
            getRegistrations,
        });
        
        console.log(getRegistrations);
    } catch (error) {
        // Handle errors
        console.error('Error fetching registrations', error);
        req.flash('error', 'Error adding registration');
        res.redirect('/');
    }
});

router.get('/reg_by_town', async (req,res)=>{
try{
    const townName = req.query.chooseTown;
   if(!townName){
    req.flash('error', 'Please make a selection');
        res.redirect('/');
        return;

   }
    const registrations = await regRoute.getRegByTown(townName)
    console.log(townName)
    res.render('index',{
        registrations
    })
    console.log(registrations)
} catch (error) {
    // Handle errors
    console.error('Error fetching registrations', error);
    req.flash('error', 'Error fetching registrations');
    res.redirect('/');
}
});

router.get('/reset', async (req, res) =>{

        await regRoute.reset();

})

export default router;
