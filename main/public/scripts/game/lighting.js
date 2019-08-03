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

function createSunLight(scene,intens,time)
{
	this.realTime = time;
	var light = new THREE.DirectionalLight(0xffffff,intens);
	light.castShadow = true;
	light.shadow.mapSize.copy(new THREE.Vector2(1000,1000));
	light.shadow.camera.zoom = .08;
	light.shadow.camera.far = 1000;
	let lightTarget = new THREE.Object3D();
	light.target = lightTarget;
	scene.add(lightTarget);
	scene.add(light);

	//add ambient
	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	//debug helper
	var helper = new THREE.CameraHelper(light.shadow.camera);
	scene.add(helper);

	this.Update = function()
	{
		let timeCycle = convertTime(this.realTime);

		light.position.set(0,-500*Math.cos(timeCycle),500*Math.sin(timeCycle));

		let phase = getDayPhase(this.realTime);
		console.log(phase);
		let color;
		let sunlerp;
		switch(phase)
		{
			case 'day':
				color = new THREE.Color(0xffffff);
				break;
			case 'night':
				color = new THREE.Color(0xa5c2f2);
				break;
			case 'sunset':
				color = new THREE.Color(0xedaf1f);
				break;
			case 'sunrise':
				color = new THREE.Color(0xedaf1f);
				break;
		}

		ambientLight.color.lerp(color,.05);
		light.color.lerp(color,.05);

		if(this.realTime > 24)
			this.realTime-=24;

		this.realTime += .01;

	}
	function convertTime(time)
	{
		return (time*(2*Math.PI)/24);
	}
	function getDayPhase(time)
	{
		if(time<5.5)
			return 'night';
		else if(time<7)
			return 'sunrise';
		else if(time<17)
			return 'day';
		else if(time<19.5)
			return 'sunset';
		else if(time>19.5)
			return 'night';
	}
}

function createAmbientLight(color)
{
	//color Ex: 0x404040
	var light = new THREE.AmbientLight(color); // soft white light
	Scene.add(light);
}
