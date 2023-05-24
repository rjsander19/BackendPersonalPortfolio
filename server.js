//Dependencies
require("dotenv").config();

const { PORT = 4000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

//Mongoose
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

//Models
const ProjectsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    technology: String,
    linkProject: String,
    linkCode: String,
    process: String,
    });
      
const Projects = mongoose.model("Projects", ProjectsSchema);

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Routes
//Test route
app.get("/", (req, res) => {
    res.send("Hello world backend page");
});

//Index
app.get("/projects", async (req, res) => {
    try {
        const projects = await Projects.find({});
        console.log(projects);
        res.json(projects);
    } catch (error) {
    res.status(500).json({ error: error.message});
    }
});

//Create
app.post("/projects", async (req, res) => {
    try {
        res.json(await Projects.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    } 
});

//Delete
app.delete("/projects/:id", async (req, res) => {
    try {
        res.json(await Projects.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

//Update
app.put("/projects/:id", async (req, res) => {
    try {
        res.json(
            await Projects.findByIdAndUpdate(req.params.id, req.body, { new:true})
        );
    } catch (error) {
        res.status(400).json(error);
    }
});





//Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));