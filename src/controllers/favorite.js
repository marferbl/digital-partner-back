const Favorite = require('../models/favorite');
const User = require('../models/user');
const Solution = require('../models/solution');
const Service = require('../models/service');
const solutionController = require('./solution');
const serviceController = require('./service');
const mongoose = require('mongoose');
const { Types } = mongoose;


// exports.getFavorites = async (req, res) => {
//     try {
//         const favorite = await Favorite.findOne({ user: req.payload._id });

//         if (!favorite) {
//             console.log('No favorites found for this user.');
//             return [];
//         }

//         const favorites = await Promise.all(favorite.entities.map(async (entity) => {
//             const { model, itemId } = entity;
//             const entityModel = model === 'Solution' ? Solution : Service;
//             const entityData = await entityModel.findById(itemId);
//             return { ...entity.toObject(), entityData };
//         }));

//         res.status(200).send({ success: true, favorites });
//     } catch (error) {
//         console.error('Error fetching favorites:', error);
//         return [];
//     }
// }

exports.getFavorites = async (req, res) => {
    const solutions = await solutionController.getAllSolutionsFilter(req, res);
    const services = await serviceController.getAllServicesFilter(req, res);
    let results = solutions.concat(services);
    let favorites = await this.getFavoritesHandler(req.payload._id);
    const favoriteIds = favorites.map(favorite => favorite.entityData._id.toString());
    results = results.filter(result => favoriteIds.includes(result._id.toString()));
    res.status(200).send({ success: true, results });
};

exports.getFavoritesHandler = async (userId) => {
    try {
        const favorite = await Favorite.findOne({ userId: userId });

        if (!favorite) {
            console.log('No favorites found for this user.');
            return [];
        }


        const favorites = await Promise.all(favorite.entities.map(async (entity) => {
            const { model, itemId } = entity;
            const entityModel = model === 'Solution' ? Solution : Service;
            const entityData = await entityModel.findById(itemId);
            return { ...entity.toObject(), entityData };
        }));

        return favorites;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

exports.addFavorite = async (req, res) => {
    const { entity } = req.body;
    const entityId = entity._id;
    const entityType = entity.lineType === 'solutions' ? 'Solution' : 'Service';

    if (!Types.ObjectId.isValid(entityId)) {
        return res.status(400).send({ success: false, message: "Invalid entityId format" });
    }
    const entityToAdd = {
        model: entityType, // "Solution" or "Service"
        itemId: entityId
    };

    try {
        const favorite = await Favorite.findOneAndUpdate(
            { userId: req.payload._id },
            { $addToSet: { entities: entityToAdd } },
            { new: true, upsert: true } // Return the updated document, and create it if it doesn't exist
        );

        await favorite.save();
        res.status(200).send({ success: true, favorite });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).send({ success: false, message: "Error adding favorite" });
    }
}

exports.removeFavorite = async (req, res) => {
    const { entityId } = req.params;

    if (!Types.ObjectId.isValid(entityId)) {
        return res.status(400).send({ success: false, message: "Invalid entityId format" });
    }

    try {
        const favorite = await Favorite.findOneAndUpdate(
            { userId: req.payload._id },
            { $pull: { entities: { itemId: entityId } } },
            { new: true }
        );

        await favorite.save();
        res.status(200).send({ success: true, favorite });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).send({ success: false, message: "Error removing favorite" });
    }
}

exports.isFavorite = async (req, res) => {
    const { entityId } = req.params;

    if (!Types.ObjectId.isValid(entityId)) {
        return res.status(400).send({ success: false, message: "Invalid entityId format" });
    }

    try {
        const favorite = await Favorite.findOne({ userId: req.payload._id });

        if (!favorite) {
            return res.status(200).send({ success: true, isFavorite: false });
        }

        const isFavorite = favorite.entities.some(entity => entity.itemId.toString() === entityId);

        res.status(200).send({ success: true, isFavorite: isFavorite });
    }
    catch (error) {
        console.error('Error checking if favorite:', error);
        res.status(500).send({ success: false, message: "Error checking if favorite" });
    }
}