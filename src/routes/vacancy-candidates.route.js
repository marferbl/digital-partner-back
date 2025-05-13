const router = require("express").Router();
const vacancyCandidatesController = require("../controllers/vacancy-candidates");
const { isAuthenticated } = require("./../middleware/jwt.middleware");


router.get("/vacancy-candidates", isAuthenticated, vacancyCandidatesController.getAllVacancyCandidates);
router.get("/vacancy-candidates/:id", isAuthenticated, vacancyCandidatesController.getVacancyCandidatesById);
router.put("/vacancy-candidates/select", isAuthenticated, vacancyCandidatesController.selectCandidate);
router.put("/vacancy-candidates/discard", isAuthenticated, vacancyCandidatesController.discardCandidate);




module.exports = router;
