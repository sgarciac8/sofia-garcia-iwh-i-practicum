const express = require("express");
const axios = require("axios");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = "2-26669455";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get("/", async (_req, res) => {
  const cobjects = `https://api.hubspot.com/crm/v3/objects/${OBJECT_TYPE}?properties=name&properties=bio&properties=favorite_food`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(cobjects, { headers });
    const data = resp.data.results;

    res.render("homepage", {
      title: "Homepage",
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get("/create-cobj", async (_req, res) => {
  res.render("updates", {
    title: "Create Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/create-cobj", async (req, res) => {
  const data = {
    properties: {
      name: req.body.name,
      bio: req.body.bio,
      favorite_food: req.body.favoriteFood,
    },
  };

  const createPet = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createPet, data, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
