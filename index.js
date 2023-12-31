import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import router from './routes/registrations.js';
import flash from 'express-flash';
import session from 'express-session';
const app = express();
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'edeea0c7-8aed-40c3-afab-48a3c5cdd878',
    resave: false,
    saveUninitialized: true
  }));
app.use(flash());
app.use('/', router)
//handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//public static
app.use(express.static('public'));

//local host 
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
