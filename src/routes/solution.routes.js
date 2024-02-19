const router = require("express").Router();
const solutionController = require('../controllers/solution.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/by-corporate", isAuthenticated, (req, res) => {
    solutionController.getSolutionsByCorporate(req, res);
});

router.post("/create", isAuthenticated, (req, res) => {
    solutionController.createSolution(req, res);
});





module.exports = router;
