const router = require("express").Router();
const referenceController = require("../controllers/reference");


router.get("/references/:id", referenceController.getAllReferencesByEntityId);
router.post("/create", referenceController.createReference);
router.post("/send", referenceController.sendReference);
router.post("/answer-reference", referenceController.finishReference);
router.get("/references-by-entity", referenceController.getReferencesByEntityDetail);






module.exports = router;
