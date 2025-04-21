const router = require("express").Router();
const vacancyController = require("../controllers/vacancy");
const { isAuthenticated } = require("./../middleware/jwt.middleware");


router.get("/vacancies", isAuthenticated, vacancyController.getAllVacancies);
router.get("/vacancies/corporate", isAuthenticated, vacancyController.getVacanciesByCorporateId);
router.post("/create", isAuthenticated, vacancyController.createVacancy);
router.put("/update/:id", isAuthenticated, vacancyController.updateVacancy);
router.delete("/delete/:id", isAuthenticated, vacancyController.deleteVacancy);






module.exports = router;
