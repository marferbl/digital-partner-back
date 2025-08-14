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
        const minPrice = parseFloat(req.query.min);
        const maxPrice = parseFloat(req.query.max);
        const type = req.query.eventType;
        const city = req.query.city;
        const from = req.query.from;
        const to = req.query.to;
        const orderBy = req.query.orderBy || 'createdAt';
        const orderValue = req.query.orderValue || 'desc';

        let filter = {};

        if (term) {
            filter.$or = [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
                { link: { $regex: term, $options: 'i' } },
            ];
        }

        if (city) {
            filter.city = city;
        }

        if (lineType) {
            filter.lineType = lineType;
        }

        // Date range filter
        if (!from) {
            filter.date = { $gte: new Date() };
        }
        if (from || to) {
            filter.date = {};
            if (from) {
                filter.date.$gte = new Date(from);
            }
            if (to) {
                filter.date.$lte = new Date(to);
            }
        }

        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.price = {};
            if (!isNaN(minPrice)) {
                filter.price.$gte = minPrice;
            }
            if (!isNaN(maxPrice)) {
                filter.price.$lte = maxPrice;
            }
        }
        if (type) {
            filter.type = type;
        }

        // Create sort object
        const sortOrder = orderValue === 'asc' ? 1 : -1;
        const sortObject = {};
        sortObject[orderBy] = sortOrder;

        const events = await Event.find({ ...filter }).populate(['corporate']).sort(sortObject);
        return events;

        // res.status(200).send({ success: true, events });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong', error });
    }
};

exports.createEvent = async (req, res) => {

    try {
        const corporateById = await Corporate.findOne({ superadmin: req.payload._id });
        const event = new Event({ ...req.body, corporate: corporateById?._id, createdBy: req.payload._id });

        await event.save();
        res.status(200).send({ success: true, event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ success: false, error });
    }
}

exports.updateEvent = async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid id format" });
    }

    try {
        const event = await Event.findByIdAndUpdate(
            id,
            { ...req.body },
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
    console.log(req.payload);
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

exports.getDistinctCities = async (req, res) => {
    try {
        const cities = await Event.distinct('city');
        res.status(200).send({ success: true, cities });
    } catch (error) {
        console.error('Error fetching distinct cities:', error);
        res.status(500).send({ success: false, error });
    }
}




