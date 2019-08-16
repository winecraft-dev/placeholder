function ModelLoader()
{
  this.preloaded = new Map();
  let loader = new THREE.GLTFLoader();

  this.preload = function(path,name)
  {
    let self = this;
    loader.load(path,function(gltf){
      let parentObject = new THREE.Object3D();
      let childrenlength = gltf.scene.children.length;
      for(let i=0;i<childrenlength;i++)
      {
        parentObject.add(gltf.scene.children[0]);
      }
      self.preloaded.set(name,parentObject);
    });
  }

  this.addToScene = function(name,options)
  {
    if(this.preloaded.has(name))
    {
      let object = this.preloaded.get(name).clone();
      object.position.copy(typeof(options.position)=='undefined'?new THREE.Vector3(0,0,0):options.position);
      global_scene.add(object);
    }
    else
    {
      setTimeout(()=>{this.addToScene(name,options)},500);
    }
  }
  this.getObject = function(name)
  {
    if(this.preloaded.has(name))
    {
      let object = this.preloaded.get(name).clone();
      return object;
    }
    else
    {
      setTimeout(()=>{this.getObject(name)},500);
    }
  }
}
