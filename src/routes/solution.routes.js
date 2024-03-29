const router = require("express").Router();
const solutionController = require('../controllers/solution.js');
const searchController = require('../controllers/search.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/by-corporate", isAuthenticated, (req, res) => {
    solutionController.getSolutionsByCorporate(req, res);
});

router.post("/create", isAuthenticated, (req, res) => {
    solutionController.createSolution(req, res);
});

router.get("/details/:id", (req, res) => {
    solutionController.getSolutionById(req, res);
});

router.get("/all", (req, res) => {
    solutionController.getAllSolutions(req, res);
});

router.put("/update/:id", isAuthenticated, (req, res) => {
    solutionController.updateSolution(req, res);
});

router.delete("/delete/:id", isAuthenticated, (req, res) => {
    solutionController.deleteSolution(req, res);
});






module.exports = router;
