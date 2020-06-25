const express = require('express');
const cors = require('cors')
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';

app.locals.pets = [
    { id: "a1", name: "Rover", type: "dog" },
    { id: "b2", name: "Marcus Aurelius", type: "parakeet" },
    { id: "c3", name: "Craisins", type: "cat" },
  ];

app.use(express.json());
app.use(express.static("public"));
app.use(cors());


app.get('/', (request, response) => {});

app.get('/api/v1/pets', (request, response) => {
    const pets = app.locals.pets;

    response.json({ pets });
});

app.get('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params;
    const pet = app.locals.pets.find(pet => pet.id === id);

    if(!pet) {
        return response.sendStatus(404);
    }

    response.status(200).json(pet);
});

app.post('/api/v1/pets', (request, response) => {
    const id = Date.now();
    const pet = request.body;

    for(let requiredParameter of ['name', 'type']) {
        if(!pet[requiredParameter]) {
            return response 
                .status(422)
                .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` 
            });
        }
    }
    
    const { name, type } = pet;
    app.locals.pets.push({ id, name, type });
    response.status(201).json({ id, name, type });
});

app.patch('/api/v1/pets', (request, response) => {
    const pet = request.body;

    for(let requiredParameter of ['id', 'name']) {
        if(!pet[requiredParameter]) {
            return response
                .status(422)
                .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` 
            });
        }
    }

    const { id, name } = pet;
    app.locals.pets.map(pet => {
        if(pet.id === id) {
            pet.name = name; 
        }
    });

    response.sendStatus(201);
});

app.delete('/api/vi/pets', (request, response) => {
    const pet = request.body;

    if(!pet.id) {
        return response 
            .status(422)
            .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a required 'id'.` 
        });
    }

    const petId = app.locals.pets.findIndex(id => id === pet.id);
    app.locals.pets.splice(petId, 1);

    return response.sendStatus(201);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});