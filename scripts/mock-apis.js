'use strict';

const express = require("express");

const app = (module.exports = express());

app.get('/userDetails', (req, res) => {
    res.send({
        name: "NoeSamaille",
        email: "noe.samaille@ibm.com",
        given_name: "Noé",
        family_name: "Samaille",
        roles: ["fs-viewer", "editor", "admin"],
        role: "admin",
        sessionExpire: new Date(Date.now()+3600*1000)
    });
    // res.json({error: "Not authenticated"});
});

const port = process.env.API_PORT || 3002;
app.listen(port, () => {
    console.log(`Server listenning on port http://localhost:${port}`);
});