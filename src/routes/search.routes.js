const router = require("express").Router();
const searchController = require('../controllers/search.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/all", (req, res) => {
    searchController.getAllItems(req, res);
});


module.exports = router;
