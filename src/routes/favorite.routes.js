const router = require("express").Router();
const favoriteController = require('../controllers/favorite.js');
const corporate = require("../models/corporate.js");
const favorite = require("../models/favorite.js");
const CompanyApplications = require("../models/company-applications.js");
const User = require("../models/user.js");

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/", isAuthenticated, async (req, res) => {
    favoriteController.getFavorites(req, res);
});

router.post("/add", isAuthenticated, async (req, res) => {
    favoriteController.addFavorite(req, res);
});

router.delete("/remove", isAuthenticated, async (req, res) => {
    favoriteController.removeFavorite(req, res);
}
);

router.get("/migration", async (req, res) => {

    User.find().then((users) => {
        users.forEach((user) => {
            const fav = new favorite({
                userId: user._id,
                favorites: [],
            });
            fav.save();
        });
    });
    res.status(200).send({ success: true });
}
);


module.exports = router;