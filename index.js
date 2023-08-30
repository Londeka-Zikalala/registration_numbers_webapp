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



app.get('/', (req, res)=>{
    res.render('index')
})


app.post('/reg_number', async (req, res) => {
    const regNumber = req.body.reg_number;
    const townId = parseInt(req.body.town); 

    if (!regNumber || isNaN(townId)) {
        res.status(400).send('Bad Request');
        return;
    }

    try {
        // Call the registration service to add the registration
        await regRoute.addReg({ regNumber, townId });

        // Redirect to the registration list
        res.render, ('index', {
            regNumber, townId
        });

    } catch (error) {
        // Handle errors
        console.error('Error adding registration', error);
        res.status(500).send('Internal Server Error');
    }

    
});

app.get('/reg_number', async (req, res) => {
    try {
        const getRegistrations = await regRoute.getReg();
        res.render('index', {
            getRegistrations
        });
        console.log(getRegistrations)
    } catch (error) {
        // Handle errors
        console.error('Error fetching registrations', error);
        res.status(500).send('Internal Server Error');
    }
  
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});

