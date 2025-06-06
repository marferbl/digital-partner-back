const router = require("express").Router();

const eventController = require('../controllers/event.js');

const { isAuthenticated } = require("./../middleware/jwt.middleware");

router.get('all', async (req, res) => {
    eventController.getEvents(req, res);
});

router.post("/create", isAuthenticated, async (req, res) => {
    eventController.createEvent(req, res);
});

router.put("/update/:id", isAuthenticated, async (req, res) => {
    eventController.updateEvent(req, res);
});

router.delete("/delete/:id", isAuthenticated, async (req, res) => {
    eventController.deleteEvent(req, res);
});

router.get('/events-by-corporate', isAuthenticated, async (req, res) => {
    eventController.getEventsByCorporate(req, res);
});

router.get('/cities/events', async (req, res) => {
    eventController.getDistinctCities(req, res);
});

router.get('/:id', async (req, res) => {
    eventController.getEvent(req, res);
});



module.exports = router;



