const EntityPlan = require('../models/entity-plan');
const Solution = require('../models/solution');
const Service = require('../models/service');
const mongoose = require('mongoose');

exports.getAllEntityPlans = async (req, res) => {
    try {
        const entityPlans = await EntityPlan.find();
        res.status(200).send({ success: true, entityPlans });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.getEntityPlan = async (req, res) => {
    try {
        const entityPlan = await EntityPlan.findById(req.params.id);
        if (!entityPlan) {
            return res.status(404).send({ message: 'Entity plan not found' });
        }
        res.status(200).send({ success: true, entityPlan });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.createEntityPlan = async (req, res) => {
    try {
        const entityPlan = await EntityPlan.create(req.body);
        res.status(201).send({ success: true, entityPlan });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.updateEntityPlan = async (req, res) => {
    try {
        const entityPlan = await EntityPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!entityPlan) {
            return res.status(404).send({ message: 'Entity plan not found' });
        }
        res.status(200).send({ success: true, entityPlan });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.deleteEntityPlan = async (req, res) => {
    try {
        const entityPlan = await EntityPlan.findByIdAndDelete(req.params.id);
        if (!entityPlan) {
            return res.status(404).send({ message: 'Entity plan not found' });
        }
        res.status(200).send({ success: true, message: 'Entity plan deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong', error });
    }
};

exports.getEntityPlansByEntityId = async (req, res) => {
    try {

        const entityPlans = await EntityPlan.find({
            entity: {
                model: req.params.model,
                itemId: new mongoose.Types.ObjectId(req.params.id)
            }
        });
        res.status(200).send({ success: true, entityPlans });
    } catch (error) {
        console.error('Error in getEntityPlansByEntityId:', error);
        res.status(500).send({ message: 'Something went wrong', error });
    }
};