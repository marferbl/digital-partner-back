const solutionController = require("./solution");
const serviceController = require("./service");
const eventController = require("./event");
const freelanceController = require("./freelance");
const OpenAI = require("openai")
const Solution = require("../models/solution");
const Service = require("../models/service");

const openai = new OpenAI();

exports.getAllItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const startIndex = (page - 1) * limit;

    let results = []

    // if (req.query.lineType === 'freelance') {
    //     results = await freelanceController.getAllWithSearchAndFilters(req, res) || [];
    // } else
    if (req.query.lineType === 'services') {
        results = await serviceController.getAllServicesFilter(req, res) || [];
    } else if (req.query.lineType === 'solutions') {
        results = await solutionController.getAllSolutionsFilter(req, res) || [];
    } else {
        results = await eventController.getAllEventsFilter(req, res) || [];
    }

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


const SPECIFY_FEATURES_LABELS = {
    ticketing: 'Ticketing',
    accounting: 'Contabilidad',
    payment: 'Facturación',
    tesoreria: 'Tesorería',
    other: 'Otros',
    crm: 'CRM',
    marketingrelational: 'Marketing relacional',
    marketingdigital: 'Marketing digital',
    time: 'Control horario',
    salary: 'Nóminas',
    personalmanagement: 'Gestión de personal',
    selection: 'Selección',
    training: 'Formación',
    performance: 'Desempeño',
    warehouse: 'Almacen',
    transport: 'Flotas',
    shopping: 'Compras',
    manufactoring: 'Manufactoring',
    bbdd: 'BBDD',
    programminglanguages: 'Lenguajes de programación',
    webSolutions: 'Soluciones para tu web',
    appSolutions: 'Soluciones app',
    helpDesk: 'Helpdesk',
    cloud: 'Servidores cloud',
    descriptiveAnalysis: 'Análisis descriptivo',
    rrss: 'RRSS',
    dataVisualization: 'Visualizacion de datos',
    clientSegmentation: 'Segmentacion de clientes',
    electronicSignature: 'Firma electrónica',
    gdpr: 'GDPR',
    grc: 'GRC',
    riskManagement: 'Risk management',
    virtualSwitchboard: 'Centralita virtual',
    documentManager: 'Gestor documental',
    productivity: 'Productividad',
    projectManagement: 'Gestión de proyectos',
    officeSuites: 'Suites ofimáticas',
    communicationAndDesign: 'Diseño & comunicación',
    ia: 'IA'
}


const FEATURES = [
    { value: 'rrhh', label: 'RRHH' },
    { value: 'sellmarketing', label: 'Ventas y marketing' },
    { value: 'finance', label: 'Finanzas y contabilidad' },
    { value: 'logistics', label: 'CSM' },
    { value: 'it', label: 'IT' },
    { value: 'data', label: 'Data' },
    { value: 'law', label: 'Legal' },
    { value: 'transversal', label: 'Transversal' },
];

function parseFilterArray(response, filterName) {
    const regex = new RegExp(`${filterName}: \\[(.*?)\\]`);
    const match = response.match(regex);
    return match ? match[1].split(',').map(item => item.trim().replace(/['"]/g, '')) : [];
}


exports.searchIA = async (req, res) => {
    const keyword = req.params.keyword;
    try {        // Fetch all solutions and services from the database
        const serviceWords = ['servicio', 'service', 'servicios', 'services', 'Servicio', 'Service', 'Servicios', 'Services'];
        if (serviceWords.some(word => keyword.includes(word))) {
            let results = await Service.find({}).populate(['solutionId', 'corporate'])

            const prompt = `Necesito hacer una busqueda precisa.
            Vamos a recibir una palabra o frase de busqueda, que es ${keyword}.
            Necesito que saques de aqui, las palabras clave, quitando articulos o otras palabras que no aporten en la busqueda, ya que voy a buscar dentro de las entradas
            que tenemos, aquellas que tengan alguna de estas palabras clave.
            damelo siempre la respuesta en formado array asi: 
            keywords: ['keyword1', 'keyword2', 'keyword3', ...]
    `

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
            const array = parseFilterArray(output, 'keywords');

            results = results.filter(result => array.some(keyword => result.title?.includes(keyword) || result.description?.includes(keyword)));

            res.status(200).send({ success: true, results });
        }

        else {
            const prompt = `Necesito hacer una busqueda precisa.
            Teniendo encuenta que buscamos soluciones, quiero que me des, dependiendo de la busqueda que hemos recibido, que es ${keyword}, la busqueda transformada en filtros.
            Los filtros que necesito son 2: features y specifyFeatures, y necesito los dos con formato de array.
            Ten en cuenta estos valores para features: ${FEATURES.map(feature => `${feature.value} es ${feature.value}`).join(', ')}.
            Y estos valores para specifyFeatures: ${Object.keys(SPECIFY_FEATURES_LABELS).map(key => `${key} es ${SPECIFY_FEATURES_LABELS[key]}`).join(', ')}.
            Transforma del texto que te ha venido, en los filtros que te he pedido, siendo lo mas preciso posible, pero sin perder informacion. Estos son algunos ejemplos:
            - Si el texto es "Quiero una solucion de RRHH", los filtros serian: features: ['rrhh'].
            - Si el texto es "Quiero una solucion de RRHH y de contabilidad", los filtros serian: features: ['rrhh', 'finance']. Y como contabilidad encaja con algun valor de specifyFeatures, se añadiria: specifyFeatures: ['accounting'].
            Por lo tanto, teniendo en cuenta que la busqueda es ${keyword}, responde solo con los filtros que te he pedido con este formato:
            1: features: ['feature1', 'feature2', ...]
            2: specifyFeatures: ['specifyFeature1', 'specifyFeature2', ...]
            Si specify features no tiene ningun valor,  devuelve un array sin ningun elemento
    `

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
            const featureFilter = parseFilterArray(output, 'features');
            const specifyFeatureFilter = parseFilterArray(output, 'specifyFeatures');

            const specifyFeatureParsed = specifyFeatureFilter?.length === 1 && specifyFeatureFilter[0] === '' ? null : specifyFeatureFilter;

            const resultsSearch = await solutionController.getAllSolutionsFilterFunction(featureFilter, specifyFeatureParsed);
            // Arrays de features y specifyFeatures extraídos

            const promptName = `Necesito hacer una busqueda precisa.
            Vamos a recibir una palabra o frase de busqueda, que es ${keyword}.
           La busqueda puede que se busque solo por el nombre de la solucion. Si es una sola palabra y no es una frase de busqueda como 'Quiero una solucion...' 'Busco una ...' o 'Solucion de rrhh' que son ejemplos de busqueda, seguramente sea el nombre directamente de una solucion. Entonces devuelveme como respuesta solo la palabra
    `

            const responseName = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: promptName,
                    },
                ],
            });


            const outputName = responseName.choices[0].message.content

            const resultsName = await Solution.find({
                $or: [
                    { name: { $regex: new RegExp(outputName, 'i') } },
                    { description: { $regex: new RegExp(outputName, 'i') } }
                ]
            });

            const results = [...resultsSearch, ...resultsName];


            res.status(200).send({ success: true, results });
        }

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

