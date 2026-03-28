const fs = require('fs');
const path = require('path');

// Read the original OpenAPI spec
const coreJsonPath = path.join(__dirname, 'core.json');
const coreData = JSON.parse(fs.readFileSync(coreJsonPath, 'utf-8'));

// Map controller names to clean names
const controllerNameMap = {
	'mail-controller': 'mail',
	'mail-folder-controller': 'mail-folder',
	'mail-recipient-controller': 'mail-recipient',
	'mail-archive-controller': 'mail-archive',
	'publication-controller': 'publication',
	'attachment-controller': 'attachment',
};

// Group paths by controller
const controllerPaths = {};
const controllerSchemas = {};

for (const [pathUrl, pathMethods] of Object.entries(coreData.paths)) {
	for (const [method, operation] of Object.entries(pathMethods)) {
		if (operation.tags && operation.tags.length > 0) {
			const controllerTag = operation.tags[0];
			if (!controllerPaths[controllerTag]) {
				controllerPaths[controllerTag] = {};
			}
			if (!controllerPaths[controllerTag][pathUrl]) {
				controllerPaths[controllerTag][pathUrl] = {};
			}
			controllerPaths[controllerTag][pathUrl][method] = operation;

			// Collect schema references
			collectSchemaRefs(operation, controllerSchemas, controllerTag);
		}
	}
}

// Function to collect schema references from an operation
function collectSchemaRefs(operation, schemas, controller) {
	if (!schemas[controller]) {
		schemas[controller] = new Set();
	}

	const collectFromObj = (obj) => {
		if (!obj || typeof obj !== 'object') return;

		if (Array.isArray(obj)) {
			obj.forEach(collectFromObj);
			return;
		}

		if (obj.$ref && obj.$ref.startsWith('#/components/schemas/')) {
			const schemaName = obj.$ref.replace('#/components/schemas/', '');
			schemas[controller].add(schemaName);
		}

		for (const value of Object.values(obj)) {
			collectFromObj(value);
		}
	};

	collectFromObj(operation);
}

// Function to get all dependent schemas recursively
function getDependentSchemas(initialSchemas, allSchemas) {
	const result = new Set(initialSchemas);
	const queue = [...initialSchemas];

	while (queue.length > 0) {
		const schemaName = queue.shift();
		const schema = allSchemas[schemaName];
		if (!schema) continue;

		const collectRefs = (obj) => {
			if (!obj || typeof obj !== 'object') return;
			if (Array.isArray(obj)) {
				obj.forEach(collectRefs);
				return;
			}
			if (obj.$ref && obj.$ref.startsWith('#/components/schemas/')) {
				const refName = obj.$ref.replace('#/components/schemas/', '');
				if (!result.has(refName)) {
					result.add(refName);
					queue.push(refName);
				}
			}
			for (const value of Object.values(obj)) {
				collectRefs(value);
			}
		};

		collectRefs(schema);
	}

	return result;
}

// Create output directory
const outputDir = path.join(__dirname, 'core');
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

// Get all schemas from the original spec
const allSchemas = coreData.components?.schemas || {};

// Generate separate files for each controller
for (const [controllerTag, paths] of Object.entries(controllerPaths)) {
	const controllerName = controllerNameMap[controllerTag] || controllerTag.replace('-controller', '');

	// Get initial schemas for this controller
	const initialSchemas = controllerSchemas[controllerTag] || new Set();

	// Get all dependent schemas
	const requiredSchemas = getDependentSchemas(initialSchemas, allSchemas);

	// Build the schemas object with only required schemas
	const filteredSchemas = {};
	for (const schemaName of requiredSchemas) {
		if (allSchemas[schemaName]) {
			filteredSchemas[schemaName] = allSchemas[schemaName];
		}
	}

	// Create the controller spec
	const controllerSpec = {
		openapi: coreData.openapi,
		info: coreData.info,
		servers: coreData.servers,
		security: coreData.security,
		paths: paths,
		components: {
			schemas: filteredSchemas,
			securitySchemes: coreData.components?.securitySchemes,
		},
	};

	// Write the file
	const outputPath = path.join(outputDir, `${controllerName}.json`);
	fs.writeFileSync(outputPath, JSON.stringify(controllerSpec, null, '\t'), 'utf-8');

	console.log(`Created: ${outputPath}`);
	console.log(`  - Paths: ${Object.keys(paths).length}`);
	console.log(`  - Schemas: ${Object.keys(filteredSchemas).length}`);
}

console.log('\nExtraction complete!');
