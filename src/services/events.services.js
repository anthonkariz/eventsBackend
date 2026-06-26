const { query } = require('../config/db');
const prisma = require('../config/prisma');

async function getAllEvents() {
	const queryText = `
		SELECT id, name, start_date, end_date, user_id, description, image_url, price
		FROM events
		ORDER BY start_date ASC, id ASC
	`;
	const result = await query(queryText);
	return result.rows;
}

async function getEventById(id) {
	const queryText = `
		SELECT id, name, start_date, end_date, user_id, description, image_url, price
		FROM events
		WHERE id = $1
		LIMIT 1
	`;
	const result = await query(queryText, [id]);
	return result.rows[0] || null;
}

async function createEvent({ name, start_date, end_date, user_id, description, image_url, price }) {
	const queryText = `
		INSERT INTO events (name, start_date, end_date, user_id, description, image_url, price)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, name, start_date, end_date, user_id, description, image_url, price
	`;
	const result = await query(queryText, [
		name,
		start_date,
		end_date,
		user_id,
		description || null,
		image_url || null,
		price,
	]);

	return result.rows[0];
}

async function updateEvent(id, { name, start_date, end_date, user_id, description, image_url, price }) {
	const queryText = `
		UPDATE events
		SET name = $2,
				start_date = $3,
				end_date = $4,
				user_id = $5,
				description = $6,
				image_url = $7,
				price = $8
		WHERE id = $1
		RETURNING id, name, start_date, end_date, user_id, description, image_url, price
	`;
	const result = await query(queryText, [
		id,
		name,
		start_date,
		end_date,
		user_id,
		description || null,
		image_url || null,
		price,
	]);

	return result.rows[0] || null;
}


async function deleteEvent(id) {
	const queryText = 'DELETE FROM events WHERE id = $1 RETURNING id';
	const result = await query(queryText, [id]);
	return Boolean(result.rows[0]);
}
async function getAllEventsPrisma() {
	return await prisma.event.findMany({
		orderBy: [
			{ start_date: 'asc' },
			{ id: 'asc' }
		]
	});
}
module.exports = {
	createEvent,
	deleteEvent,
	getAllEvents,
	getEventById,
	updateEvent,
	getAllEventsPrisma,
};
