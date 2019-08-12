function ModelLoader(scene)
{
  let loader = new THREE.GLTFLoader();
  loader.load('/models/BigHeadPerson.glb',function(gltf){
    console.log(gltf);
    let person = new THREE.Object3D();
    /*
    gltf.forEach(function(object){
      let part = object;
      part.material = new THREE.MeshStandardMaterial({color:0xff0fff});
      part.castShadow = true;
  		part.receiveShadow = true;
      person.add();
    });
    */
    scene.add(gltf.scene.children[0]);
    scene.add(gltf.scene.children[1]);
    scene.add(gltf.scene.children[2]);
  });
}
