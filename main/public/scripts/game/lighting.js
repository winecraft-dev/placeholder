function createSpotLight(color,pos,angle,dis,intens,pen)
{
	var light = new THREE.SpotLight(color,intens,dis,angle,pen);
	light.position.set(pos.x,pos.y,pos.z);
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	Scene.add(light);

	//debug helper
	var helper = new THREE.CameraHelper(light.shadow.camera);
	Scene.add(helper);
}

function createSunLight(color,intens,pos,rot)
{
	var light = new THREE.DirectionalLight(color,intens);
	light.position.copy(pos);
	light.castShadow = true;
	light.shadow.mapSize.copy(new THREE.Vector2(1000,1000));
	light.shadow.camera.zoom = 1;
	let lightTarget = new THREE.Object3D();
	lightTarget.position.copy(rot);
	light.target = lightTarget;
	Scene.add(lightTarget);
	Scene.add(light);

	//debug helper
	var helper = new THREE.CameraHelper(light.shadow.camera);
	Scene.add(helper);
}

function createAmbientLight(color)
{
	//color Ex: 0x404040
	var light = new THREE.AmbientLight(color); // soft white light
	Scene.add(light);
}
