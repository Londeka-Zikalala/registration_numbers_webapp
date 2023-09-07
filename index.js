import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import db from './db.js';
import flash from 'express-flash';
import session from 'express-session';
import regService from './service/reg_number_service.js';
const app = express();
const regRoute = regService(db)
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'edeea0c7-8aed-40c3-afab-48a3c5cdd878',
    resave: false,
    saveUninitialized: true
  }));
app.use(flash());
//handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//public static
app.use(express.static('public'));

//local host 
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.render('index', { messages: req.flash() });
});

app.post('/reg_number', async (req, res) => {
    const regNumber = req.body.regNumber;
    const RegExp = /^([A-Z]{2}\s?\d{3}-\d{3})$|^([A-Z]{2}\s?\d{4})$|^([A-Z]{2}\s?\d{7})$|^([A-Z]{2}\s?\d{3}\s\d{3})$|^([A-Z]{2}\s?\d{3})$/;


    if (regNumber === "" || !RegExp.test(registration)) {
        res.status(400).send('Invalid input');
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
        res.status(500).send('Error adding registration');
    }
});

app.get('/reg_number', async (req, res) => {
    try {
        let getRegistrations = await regRoute.getReg();
        res.render('index', {
            getRegistrations
        });
        
        console.log(getRegistrations);
    } catch (error) {
        // Handle errors
        console.error('Error fetching registrations', error);
        res.status(500).send('Error fetching registrations');
    }
});

app.get('/reg_by_town', async (req,res)=>{
try{
    const townName = req.query.chooseTown;
   
    const registrations = await regRoute.getRegByTown(townName)
    console.log(townName)
    res.render('index',{
        registrations
    })
    console.log(registrations)
} catch (error) {
    // Handle errors
    console.error('Error fetching registrations', error);
    res.status(500).send('Error fetching registrations');
}
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
