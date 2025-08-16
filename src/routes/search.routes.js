const router = require("express").Router();
const searchController = require('../controllers/search.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");


router.get("/all", (req, res) => {
    searchController.getAllItems(req, res);
});

router.get("/optimize/:keyword", (req, res) => {
    searchController.searchIA(req, res);
});

router.post("/comparation", isAuthenticated, (req, res) => {
    searchController.getComparationBetweenTwoSolutions(req, res);
});



module.exports = router;
