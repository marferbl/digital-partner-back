const Corporate = require('../models/corporate');
const Reference = require('../models/reference');
const Solution = require('../models/solution');
const Service = require('../models/service');
const nodemailer = require('nodemailer');

exports.getAllReferencesByEntityId = async (req, res) => {
    try {
        const references = await Reference.find({ corporateId: req.params.id });

        const result = await Promise.all(
            references.map(async (reference) => {
                const model = reference.entity.model;
                let entityObject = {};

                if (model === 'solution') {
                    entityObject = await Solution.findById(reference.entity.itemId);
                } else {
                    entityObject = await Service.findById(reference.entity.itemId);
                }

                return { ...reference.toObject(), entityName: entityObject?.name || 'Unknown' };
            })
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createReference = async (req, res) => {
    try {
        const { entity, answers, email } = req.body;
        const model = entity.model;

        let entityResult = null

        if (model === 'solution') {
            entityResult = await Solution
                .findById(entity.itemId).populate('corporate');
        } else {
            entityResult = await Service
                .findById(entity.itemId).populate('corporate');
        }


        const corporateId = entityResult.corporate._id;

        const reference = await Reference.create({ entity, answers, email, corporateId });
        res.status(201).json(reference);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.sendReference = async (req, res) => {
    const { email, entityId, entityType } = req.body;

    try {
        // Fetch the solution name
        const solution = await Solution.findById(entityId);

        if (!solution) {
            return res.status(404).json({ status: 404, message: 'La solución no fue encontrada.' });
        }

        // Configure the transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email configurations
        const mailConfigurations = {
            from: {
                name: 'Equipo Digitalando',
                address: 'digitalandocompany@gmail.com',
            },
            to: email,
            subject: 'Solicitud para completar la referencia',
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #007BFF;">Completa la referencia</h2>
                <p>Estimado usuario,</p>
                <p>
                  Necesitamos tu respuesta para completar la referencia sobre la solución: <strong>${solution.name}</strong>.
                  Por favor, haz clic en el siguiente enlace para proporcionar tu respuesta:
                </p>
                <p>
                  <a 
                    href="https://www.digitalando.org//reference-answer/${entityId}?entityType=${entityType}&email=${encodeURIComponent(email)}" 
                    style="color: #007BFF; text-decoration: none; font-weight: bold;">
                    Completar referencia
                  </a>
                </p>
                <p>
                  O haz click en el siguiente enlace
                </p>
                <p style="background: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  https://www.digitalando.org//reference-answer/${entityId}?entityType=${entityType}&email=${encodeURIComponent(email)}
                </p>
                <p>
                  Gracias,<br>
                  <strong>Equipo Digitalando</strong>
                </p>
              </div>
            `,
        };

        // Send the email
        transporter.sendMail(mailConfigurations, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                throw new Error('No se pudo enviar el correo.');
            } else {
                console.log('Correo enviado exitosamente:', info.response);
            }
        });

        res.status(200).json({ status: 200, message: 'Correo enviado exitosamente.' });
    } catch (error) {
        console.error('Error en el proceso:', error.message);
        res.status(500).json({ status: 500, message: 'Error al enviar el correo.', error: error.message });
    }
};


