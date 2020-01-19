const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket');

// index (listar), show (mostrar um), store, update, destroy
module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            // Filtrar as conexões que estão a, no máximo, 50 km de distância
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas
        
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return response.json(dev);
    },

    async update(request, response) {
        const { github_username } = request.params;
        const { name, bio, techs, avatar_url, latitude, longitude } = request.body;

        const techsArray = parseStringAsArray(techs);
        
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        await Dev.updateOne({ github_username }, { $set: { name, bio, techs: techsArray, avatar_url, location }});

        const dev = await Dev.findOne({ github_username });

        return response.json(dev);
    },

    async destroy(request, response) {
        const { github_username } = request.params;

        await Dev.deleteOne({ github_username });

        return response.json({ message: 'Feito' });
    },
};