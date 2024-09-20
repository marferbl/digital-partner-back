const solutionController = require("./solution");
const serviceController = require("./service");
const OpenAI = require("openai")
const Solution = require("../models/solution");
const Service = require("../models/service");

const openai = new OpenAI();

exports.getAllItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const startIndex = (page - 1) * limit;
    const solutions = await solutionController.getAllSolutionsFilter(req, res);
    const services = await serviceController.getAllServicesFilter(req, res);
    const results = solutions.concat(services);

    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    const paginatedResults = results.slice(startIndex, startIndex + limit);


    res.status(200).send({
        success: true, meta: {
            totalResults,
            totalPages,
            currentPage: page,
            limit
        }, results: paginatedResults
    });
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

exports.getComparationBetweenTwoSolutions = async (req, res) => {
    const { solutionId1, solutionId2, text } = req.body;
    try {
        const solution1 = await Solution
            .findById(solutionId1)
        const solution2 = await Solution
            .findById(solutionId2)

        const prompt = `
        Here are two solutions to compare:
        Solution 1:
        Id: ${solution1._id}
        Type: ${solution1.lineType}
        Name: ${solution1.name || solution1.title}
        Description: ${solution1.description}
        ServiceType: ${solution1.serviceType}
        Features: ${solution1.features ? solution1.features.join(', ') : ''}
        Specify Features: ${solution1.specifyFeatures ? solution1.specifyFeatures.join(', ') : ''}
        Languages: ${solution1.languages ? solution1.languages.join(', ') : ''}
        Countries: ${solution1.countries ? solution1.countries.join(', ') : ''}
        Is Sectorial: ${solution1.isSectorial}
        Sector Type: ${solution1.sectorType}
        Is ERP: ${solution1.isErp} 
        Solution 2:
        Id: ${solution2._id}
        Type: ${solution2.lineType}
        Name: ${solution2.name || solution2.title}
        Description: ${solution2.description}
        ServiceType: ${solution2.serviceType}
        Features: ${solution2.features ? solution2.features.join(', ') : ''}
        Specify Features: ${solution2.specifyFeatures ? solution2.specifyFeatures.join(', ') : ''}
        Languages: ${solution2.languages ? solution2.languages.join(', ') : ''}
        Countries: ${solution2.countries ? solution2.countries.join(', ') : ''}
        Is Sectorial: ${solution2.isSectorial}
        Sector Type: ${solution2.sectorType}
        Is ERP: ${solution2.isErp}
        Which solution is better, give me a comparartion (maximum of 800 characters ) in spanish between them with pros and cons taking into account the next text: 
        ${text}.
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

        const output = response.choices[0].message.content.trim();
        res.status(200).send({ success: true, output });

    } catch (error) {
        console.error("Error comparing two solutions:", error);
        return [];
    }
}

