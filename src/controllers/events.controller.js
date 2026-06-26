const eventsService = require('../services/events.services');
const prisma = require('../config/prisma');



function parseEventPayload(body = {}) {
	// Matches the events schema columns: name, start_date, end_date, user_id, description, image_url, price.
	return {
		name: typeof body.eventName === 'string'
			? body.eventName.trim()
			: typeof body.name === 'string'
				? body.name.trim()
				: '',		
		//userId: Number(body.userId),
		description: body.description,
		startDate: body.startDateTime || body.startDate,
		endDate: body.endDateTime || body.endDate,
		imageUrl: body.imageUrl,
		price: Number(body.price),
	};
}

function validateEventPayload(payload) {
	if (!payload.name || !payload.startDate || !payload.endDate) {
		return 'eventName, startDateTime and endDateTime are required!';
	}

	if (!Number.isFinite(payload.price) || payload.price < 0) {
		return 'price must be a non-negative number';
	}

	if (new Date(payload.startDate) > new Date(payload.endDate)) {
		return 'startDateTime must be before or equal to endDateTime';
	}

	return null;
}

async function getEvents(req, res) {
	const events = await prisma.event.findMany({
		orderBy: [
			{ startDate: 'asc' },
			{ id: 'asc' }
		]
	});

	return res.json(events);
}

async function getEventById(req, res) {
	const eventId = Number(req.params.id);

	if (!Number.isInteger(eventId) || eventId <= 0) {
		return res.status(400).json({ error: 'Event id must be a positive integer' });
	}

	const event = await eventsService.getEventById(eventId);

	if (!event) {
		return res.status(404).json({ error: 'Event not found' });
	}

	return res.json(event);
}

async function createEvent(req, res) {
	const payload = parseEventPayload(req.body);
// return res.status(400).json({ error: payload });
	const validationError = validateEventPayload(payload);

	if (validationError) {
		return res.status(400).json({ error: validationError });
	}

	//const created = await eventsService.createEvent(payload);
	const created = await prisma.event.create({
		data: {
		name: payload.name,	
		startDate: payload.startDate,
		endDate: payload.endDate,
		userId: req.user.user_id,
		description: payload.description || null,
		imageUrl: payload.imageUrl || null,	
	price: payload.price,
		},
	});

	
	return res.status(201).json(created);

	
}

async function updateEvent(req, res) {
	const eventId = Number(req.params.id);

	if (!Number.isInteger(eventId) || eventId <= 0) {
		return res.status(400).json({ error: 'Event id must be a positive integer' });
	}

	const payload = parseEventPayload(req.body);
	const validationError = validateEventPayload(payload);

	if (validationError) {
		return res.status(400).json({ error: validationError });
	}

	const updated = await eventsService.updateEvent(eventId, payload);

	if (!updated) {
		return res.status(404).json({ error: 'Event not found' });
	}

	return res.json(updated);
}

async function deleteEvent(req, res) {
	const eventId = Number(req.params.id);

	if (!Number.isInteger(eventId) || eventId <= 0) {
		return res.status(400).json({ error: 'Event id must be a positive integer' });
	}

	const deleted = await eventsService.deleteEvent(eventId);

	if (!deleted) {
		return res.status(404).json({ error: 'Event not found' });
	}

	return res.status(204).send();
}

module.exports = {
	createEvent,
	deleteEvent,
	getEventById,
	getEvents,
	updateEvent,
};
