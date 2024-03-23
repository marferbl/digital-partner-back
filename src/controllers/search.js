const solutionController = require("./solution");
const serviceController = require("./service");

exports.getAllItems = async (req, res) => {
    const solutions = await solutionController.getAllSolutionsFilter(req, res);
    const services = await serviceController.getAllServicesFilter(req, res);
    const results = solutions.concat(services);
    res.status(200).send({ success: true, results });
};
