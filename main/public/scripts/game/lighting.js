function createSpotLight(color,pos,angle,dis,intens,pen)
{
	var light = new THREE.SpotLight(color,intens,dis,angle,pen);
	light.position.set(pos.x,pos.y,pos.z);
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	scene.add(light);

	//debug helper
	var helper = new THREE.CameraHelper(light.shadow.camera);
	scene.add(helper);
}

function createSunLight(intens,pos,rot)
{
	var light = new THREE.DirectionalLight(0xffffff,intens);
	light.position.copy(pos);
	light.castShadow = true;
	light.shadow.mapSize.copy(new THREE.Vector2(1000,1000));
	light.shadow.camera.zoom = .08;
	let lightTarget = new THREE.Object3D();
	lightTarget.position.copy(rot);
	light.target = lightTarget;
	scene.add(lightTarget);
	scene.add(light);

	//add ambient
	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	//debug helper
	var helper = new THREE.CameraHelper(light.shadow.camera);
	scene.add(helper);

	let timeCycle = 0;

	this.Update = function()
	{
		light.position.set(0,50*Math.sin(timeCycle),50*Math.cos(timeCycle));

		if(timeCycle<Math.PI/6)
		{
			//Morning
			ambientLight.color.lerp(new THREE.Color(0xf0991f),.01);
			light.color.lerp(new THREE.Color(0xf0991f),.01);
		}
		else if(timeCycle<(Math.PI*5)/6)
		{
			//Evening
			ambientLight.color.lerp(new THREE.Color(0xffffff),.01);
			light.color.lerp(new THREE.Color(0xffffff),.01);
		}
		else if(timeCycle<Math.PI)
		{
			//sunset
			ambientLight.color.lerp(new THREE.Color(0xf0991f),.01);
			light.color.lerp(new THREE.Color(0xf0991f),.01);
		}
		else if(timeCycle>Math.PI)
		{
			//night
			ambientLight.color.lerp(new THREE.Color(0xa5c2f2),.01);
			light.color.lerp(new THREE.Color(0xa5c2f2),.01);
		}

		if(timeCycle>2*Math.PI)
			timeCycle-=2*Math.PI;

		timeCycle += Math.PI/2000;
	}
}

function createAmbientLight(color)
{
	//color Ex: 0x404040
	var light = new THREE.AmbientLight(color); // soft white light
	scene.add(light);
}
