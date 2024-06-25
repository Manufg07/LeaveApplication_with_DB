const express = require('express');
const path = require('path')
const mongoose = require ('mongoose');
const dotenv = require('dotenv');
const sample = require('./Models/Leave')
// const favicon = require('serve-favicon');
const app = express();

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

dotenv.config();
const url = process.env.mongodb_uri;
mongoose.connect(
    url
)

const database = mongoose.connection;
database.on('error', (error) =>{
    console.log(error)
});
database.once('connected', () =>{
    console.log("Database Connected")
});

app.get('/index', (req, res) =>{
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

app.get('/leave', (req, res) =>{
    res.sendFile(path.join(__dirname,'Public', 'leave.html'));
});

app.post('/submit-form' , async (req,res )=>{
    try{
        const data = req.body;
        console.log(data);
        const details = await sample.create(data);
        res.status(201).redirect('/success');
    }
    catch(error){
        console.log(error);
        res.status(500).json;
    }
});

app.get('/success', (req,res) =>{
    res.sendFile(path.join(__dirname,'Public', 'success.html'));
});


app.get('/leave/:id', (req,res) => {
    res.sendFile(path.join(__dirname, 'Public', 'leave.html' ))
});

app.get('/api/leaves',async (req,res) =>{
    try{
        const Leaves =await sample.find();
        res.json(Leaves);
        console.log(Leaves)
    }
    catch(error){
        res.status(500).json({error:'Cannot fetch the applications'});
    }
});

app.delete('/api/leave/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedLeave = await sample.findByIdAndDelete(id);
        if (!deletedLeave) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.use((req, res) =>{
    res.status(404).send('page not found');
});

app.listen(3005, () => {
    console.log(`server is running on ${3005}`);
});