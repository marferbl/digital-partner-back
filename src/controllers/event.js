const Event = require('../models/event');
const Corporate = require('../models/corporate');
const Types = require('mongoose').Types;

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        return events
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send({ success: false, error });
    }
}

exports.getAllEventsFilter = async (req, res) => {
    try {
        const term = req.query.term;
        const lineType = req.query.lineType;

        let filter = {};

        if (term) {
            filter.$or = [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
                { link: { $regex: term, $options: 'i' } },
            ];
        }

        if (lineType) {
            filter.lineType = lineType;
        }


        const events = await Event.find({ ...filter }).populate(['corporate'])
        return events;

        // res.status(200).send({ success: true, services });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong', error });
    }
};

exports.createEvent = async (req, res) => {

    try {
        const corporateById = await Corporate.findOne({ superadmin: req.payload._id });
        const event = new Event({ ...req.body, corporate: corporateById?._id });

        await event.save();
        res.status(200).send({ success: true, event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ success: false, error });
    }
}

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, description, photo, type, link, corporate, maximumCapacity, date, time, duration } = req.body;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid id format" });
    }

    try {
        const event = await Event.findByIdAndUpdate(
            id,
            {
                name,
                description,
                photo,
                type,
                link,
                corporate,
                maximumCapacity,
                date,
                time,
                duration
            },
            { new: true }
        );

        await event.save();
        res.status(200).send({ success: true, event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send({ success: false, error });
    }
}

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        await Event.findByIdAndDelete(id);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ success: false, error });
    }
}

exports.getEventsByCorporate = async (req, res) => {

    const corporateById = await Corporate.findOne({ superadmin: req.payload._id });
    try {
        const events = await Event.find({ corporate: corporateById._id }).populate('corporate');
        res.status(200).send({ success: true, events });
    } catch (error) {
        console.error('Error fetching events by corporate:', error);
        res.status(500).send({ success: false, error });
    }
}

exports.getEvent = async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid id format" });
    }

    try {
        const event = await Event.findById(id).populate('corporate');
        res.status(200).send({ success: true, event });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).send({ success: false, error });
    }
}


