function modelLoader()
{
  this.preloaded = new Map();
  var loader = new THREE.GLTFLoader();

  this.preload = function(str,name)
  {
    loader.load(str,(gltf)=>{
      let gameObject = new THREE.Object3D();
      let meshlength = gltf.scene.children.length;
      for(let i=0; i<meshlength; i++)
      {
        gameObject.add(gltf.scene.children[0]);
      }
      this.preloaded.set(name,gameObject);
    });
  }
  this.getModel = (name)=>{
    if(this.preloaded.has(name))
    {
      //model is loaded
      return this.preloaded.get(name);
    }
    else
    {
      //wait for model
      setTimeout(this.getModel,1000,name);
    }
  };
}
