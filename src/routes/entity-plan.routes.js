const router = require("express").Router();
const entityPlanController = require('../controllers/entity-plan');
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// Get all entity plans
router.get("/", isAuthenticated, entityPlanController.getAllEntityPlans);

// Get a specific entity plan
router.get("/:id", isAuthenticated, entityPlanController.getEntityPlan);

// Create a new entity plan
router.post("/", isAuthenticated, entityPlanController.createEntityPlan);

// Update an entity plan
router.put("/:id", isAuthenticated, entityPlanController.updateEntityPlan);

// Delete an entity plan
router.delete("/:id", isAuthenticated, entityPlanController.deleteEntityPlan);

// Get all entity plans by entity id
router.get("/entity/:id/:model", isAuthenticated, entityPlanController.getEntityPlansByEntityId);

module.exports = router; 