const router = require("express").Router();
const solutionController = require('../controllers/solution.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/by-corporate", isAuthenticated, async (req, res) => {
    const solutions = await solutionController.getSolutionsByCorporate(req, res);
    res.sendStatus(200).send(solutions);
});

router.post("/", isAuthenticated, async (req, res) => {
    const solution = await solutionController.createSolution(req, res);
    res.sendStatus(200).send(solution);
});




module.exports = router;
