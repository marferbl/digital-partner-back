const router = require("express").Router();
const corporateController = require('../controllers/corporate.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/owner", isAuthenticated, async (req, res) => {
    corporateController.getCorporate(req, res);
});
router.post("/create", isAuthenticated, async (req, res) => {
    corporateController.createCorporate(req, res);
});
router.put("/update", isAuthenticated, async (req, res) => {
    corporateController.updateCorporate(req, res);
});
router.delete("/delete", isAuthenticated, async (req, res) => {
    corporateController.deleteCorporate(req, res);
});
router.get('/applications/:id', isAuthenticated, async (req, res) => {
    corporateController.getApplications(req, res);
});



module.exports = router;
