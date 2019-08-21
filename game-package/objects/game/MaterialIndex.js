const CANNON = require('cannon');

var materials = new Map();
materials.set('playerMaterial', new CANNON.Material('playerMaterial'));
materials.set('groundMaterial', new CANNON.Material('groundMaterial'));

var contactMaterials = new Set();
contactMaterials.add(new CANNON.ContactMaterial(materials.get('groundMaterial'), materials.get('groundMaterial'), {
	friction: .4,
	restitution: .3,
	contactEquationStiffness: 1e8,
	contactEquationRelaxation: 3,
	frictionEquationStiffness: 1e8,
	frictionEquationRegularizationTime: 3
}));
contactMaterials.add(new CANNON.ContactMaterial(materials.get('playerMaterial'), materials.get('groundMaterial'), {
	friction: 0.03,
	restitution: .3,
	contactEquationStiffness: 1e8,
	contactEquationRelaxation: 3
}));

exports.getMaterial = function(name)
{
	if(materials.has(name))
		return materials.get(name);
	return null;
};

exports.addContactMaterials = function(world)
{
	for(var contactMaterial of contactMaterials)
	{
		world.addContactMaterial(contactMaterial);
	}
};