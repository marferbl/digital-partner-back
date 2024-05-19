const solutionController = require("./solution");
const serviceController = require("./service");
const OpenAI = require("openai")
const Solution = require("../models/solution");
const Service = require("../models/service");

const openai = new OpenAI();

exports.getAllItems = async (req, res) => {
    const solutions = await solutionController.getAllSolutionsFilter(req, res);
    const services = await serviceController.getAllServicesFilter(req, res);
    const results = solutions.concat(services);
    res.status(200).send({ success: true, results });
};


exports.searchIA = async (req, res) => {
    const keyword = req.params.keyword;
    try {
        // Fetch all solutions and services from the database
        const solutions = await Solution.find({})
        const services = await Service.find({}).populate(['solutionId', 'corporate'])

        // Prepare the data for the OpenAI API
        const allEntries = [...solutions, ...services].map(entry => ({
            id: entry.id,
            type: entry.lineType,
            name: entry.name || entry.title,
            description: entry.description,
            features: entry.features,
            specifyFeatures: entry.specifyFeatures,
            languages: entry.languages,
            countries: entry.countries,
            serviceType: entry.serviceType,
            isSectorial: entry.isSectorial,
            sectorType: entry.sectorType,
            isErp: entry.isErp,
            content: `
            Id: ${entry._id}
          Type: ${entry.lineType}
          Name: ${entry.name || entry.title}
          Description: ${entry.description}
          ServiceType: ${entry.serviceType}
          Features: ${entry.features ? entry.features.join(', ') : ''}
          Specify Features: ${entry.specifyFeatures ? entry.specifyFeatures.join(', ') : ''}
          Languages: ${entry.languages ? entry.languages.join(', ') : ''}
          Countries: ${entry.countries ? entry.countries.join(', ') : ''}
          Is Sectorial: ${entry.isSectorial}
          Sector Type: ${entry.sectorType}
          Is ERP: ${entry.isErp}
        `
        }));

        // Prepare the prompt for OpenAI API
        const prompt = `
        Here are some solutions and services:
        ${allEntries.map(entry => entry.content).join('\n\n')}
        
        Based on the keyword "${keyword}", which solutions or services are most relevant? Give me the ids of each relevant solution or service. Take into account that the atribute lineType is the type of the entry, it can be "solutions" or "services".
      `;



        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        // Process the response
        const output = response.choices[0].message.content.trim();
        const allResults = [...solutions, ...services];

        const results = allResults.filter(entry => output.includes(entry.id));

        res.status(200).send({ success: true, results });

    } catch (error) {
        console.error("Error searching for keyword:", error);
        return [];
    }
}
