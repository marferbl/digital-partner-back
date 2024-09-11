const router = require("express").Router();
const serviceController = require('../controllers/service.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get("/by-corporate", isAuthenticated, (req, res) => {
    serviceController.getServiceByUserCorporate(req, res);
});

router.get("/:id", isAuthenticated, (req, res) => {
    serviceController.getServiceById(req, res);
});

router.post("/create", isAuthenticated, (req, res) => {
    serviceController.createService(req, res);
});

router.put("/update/:id", isAuthenticated, (req, res) => {
    serviceController.updateService(req, res);
});

router.delete("/delete/:id", isAuthenticated, (req, res) => {
    serviceController.deleteService(req, res);
});

router.get("/details/:id", (req, res) => {
    serviceController.getServiceById(req, res);
});

router.get("/all", isAuthenticated, (req, res) => {
    serviceController.getAllServices(req, res);
});

router.get("/by-solution/:id", isAuthenticated, (req, res) => {
    serviceController.getServicesBySolution(req, res);
});




module.exports = router;
