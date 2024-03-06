const router = require("express").Router();
const solutionController = require('../controllers/solution.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/by-corporate", isAuthenticated, (req, res) => {
    solutionController.getSolutionsByCorporate(req, res);
});

router.post("/create", isAuthenticated, (req, res) => {
    solutionController.createSolution(req, res);
});

router.get("/details/:id", isAuthenticated, (req, res) => {
    solutionController.getSolutionById(req, res);
});

router.get("/all", (req, res) => {
    solutionController.getAllSolutions(req, res);
});




module.exports = router;
