const router = require("express").Router();
const searchController = require('../controllers/search.js');


router.get("/all", (req, res) => {
    searchController.getAllItems(req, res);
});

router.get("/optimize/:keyword", (req, res) => {
    searchController.searchIA(req, res);
});


module.exports = router;
