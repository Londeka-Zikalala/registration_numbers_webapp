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
    let regNumber = req.body.regNumber;
     regNumber = await regRoute.transformReg(regNumber)
    if (!regNumber) {
        req.flash('error', 'Please enter a valid registration number');
        res.redirect('/');
        return;
    }

    try {
        // Call the registration service to add the registration
        await regRoute.addReg(regNumber);
        req.flash('success', `Registration number ${regNumber} added successfully!`);

        // Redirect to the registration list after adding
        res.redirect('/');
    } catch (error) {
        // Handle errors
        console.error('Error adding registration', error);
        if (error.message === 'Registration already exists') {
            req.flash('error', 'Registration already exists');
        } else {
            req.flash('error','Please enter valid registration');
        }
        res.redirect('/');
    }
});

router.get('/reg_number', async (req, res) => {
    try {

        let getRegistrations = await regRoute.getReg();

            res.redirect('/')
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
    if (registrations.length === 0) {
        req.flash('error', `No registration numbers from ${townName}`);
        res.redirect('/');
        return;

    }
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


router.get('/reset', async (req, res) => {
    try {
      await regRoute.reset()
      res.status(200).json({ message: 'Reset successful!' });
    } catch (error) {
      console.error('Error resetting data', error);
      res.status(500).json({ message: 'Error resetting data' });
    }
});

export default router;
