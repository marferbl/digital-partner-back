const router = require("express").Router();
const corporateController = require('../controllers/corporate.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/owner", isAuthenticated, async (req, res) => {
    corporateController.getCorporate(req, res);
});
router.post("/create", isAuthenticated, async (req, res) => {
    corporateController.createCorporate(req, res);
});



module.exports = router;
