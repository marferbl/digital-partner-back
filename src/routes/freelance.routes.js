const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const freelanceController = require('../controllers/freelance.js');

router.get("/me", isAuthenticated, async (req, res) => {
    freelanceController.getFreelance(req, res);
});

router.post("/create", isAuthenticated, async (req, res) => {
    freelanceController.createFreelance(req, res);
});

router.put("/update", isAuthenticated, async (req, res) => {
    freelanceController.updateFreelance(req, res);
});

router.delete("/delete", isAuthenticated, async (req, res) => {
    freelanceController.deleteFreelance(req, res);
});

router.get("/details/:id", async (req, res) => {
    freelanceController.getFreelanceById(req, res);
});




module.exports = router;
