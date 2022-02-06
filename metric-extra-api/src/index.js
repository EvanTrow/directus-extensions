'use strict';

function register(router, { services, database, getSchema }) {
	router.get('/:id', async function (req, res) {
		try {
			const panelData = await database.raw(`SELECT "options", "id" FROM "directus_panels" WHERE "id" = ? `, [req.params.id]);
			const panelOpts = JSON.parse(panelData[0].options);

			const data = await database.raw(`SELECT SUM(${panelOpts.collection2}.${panelOpts.sumfield}) as value
			FROM ${panelOpts.collection1}
			INNER JOIN ${panelOpts.collection2} on ${panelOpts.collection2}.${panelOpts.field2}=${panelOpts.collection1}.${panelOpts.field1}`);

			res.json(data[0].value);
		} catch (error) {
			console.log(error);
			res.json('Error');
		}
	});
}

module.exports = register;
