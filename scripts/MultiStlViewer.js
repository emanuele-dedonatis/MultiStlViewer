var stl_viewer;
var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
              '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
              '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
              '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
              '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
              '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
              '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
              '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
              '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
              '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

// Variables for mouse pointer
let intersectedObject, intersectedPoint, raycaster, pointer;
let markerObjectIds = [];

function model_loaded_callback(model_id) {
  // Get first available color
  const color = colors.shift();
  stl_viewer.set_color(model_id, color);
  colors.push(color);

  // Get model name from filename
  const model_info = stl_viewer.get_model_info(model_id);
  const model_name = model_info.name.split("/").pop().replace(".stl","");

  // Add list item of loaded model
  var ul= document.getElementById("files_list");
  ul.innerHTML += `<li id=${model_name}>${model_name} \
                      <input class="slider" \
                              type="range" \
                              min="0" \
                              max="100" \
                              step="1" \
                              value="100" \
                              oninput="setModelOpacity(${model_id}, this.value)"
                              onchange="setModelOpacity(${model_id}, this.value)"
                              >
                    </li>`;
}

function setModelOpacity(model_id, value) {
    stl_viewer.set_opacity(model_id, value/100);
}

function loading_progress_callback() {
  // Loading models: display loader
  document.getElementById("loader").style.display = "block";
}

function all_loaded_callback() {
  // All models have been loaded: hide loader
  document.getElementById("loader").style.display = "none";
  
  // Configure mouse pointer
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  document.addEventListener( 'mousemove', onPointerMove );
  addEventListener("dblclick", onDoubleClick);
  colorPointedObject();
}

function onPointerMove( event ) {
	// Update mouse coordinates
  pointer.x = ( ( event.clientX - stl_viewer.renderer.domElement.offsetLeft ) / stl_viewer.renderer.domElement.clientWidth ) * 2 - 1;
  pointer.y = - ( ( event.clientY - stl_viewer.renderer.domElement.offsetTop ) / stl_viewer.renderer.domElement.clientHeight ) * 2 + 1;
}

function colorPointedObject() {
  // Recall this function for animation
  requestAnimationFrame( colorPointedObject );

  // Add raycaster
  raycaster.setFromCamera( pointer, stl_viewer.camera );

  // Get intersections
  let intersects = raycaster.intersectObjects( stl_viewer.scene.children, false );

  // Remove intersections with markers
  intersects = intersects.filter((doc) => !markerObjectIds.includes(doc.object.id))

  if ( intersects.length > 0 ) {
    // Update intersected point
    intersectedPoint = intersects[ 0 ].point;
    
    // Get first instersection since are returned sorted by distance, closest first
    if ( intersectedObject != intersects[ 0 ].object ) {

      if ( intersectedObject ) intersectedObject.material.color.setHex( intersectedObject.currentHex );

      intersectedObject = intersects[ 0 ].object;
      intersectedObject.currentHex = intersectedObject.material.color.getHex();
      intersectedObject.material.color.setHex( 0xffff00 );

    }

  } else {
    // Clear intersected point
    intersectedPoint = null;

    if ( intersectedObject ) intersectedObject.material.color.setHex( intersectedObject.currentHex );

    intersectedObject = null;

  }

  stl_viewer.renderer.render( stl_viewer.scene, stl_viewer.camera );
}

function onDoubleClick() {
  if ( intersectedPoint )
  {
    // Add mesh
    const geometry = new THREE.SphereGeometry( 2, 8, 8 ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
    const circle = new THREE.Mesh( geometry, material );
    stl_viewer.scene.add( circle );
    circle.position.copy(intersectedPoint);

    // Save id to filter raycaster intersections
    markerObjectIds.push(circle.id);
  }
}

function loadMultiStlViewer(files) {
  stl_viewer = new StlViewer(
    document.getElementById("stl_cont"),
    {
      loading_progress_callback,
      all_loaded_callback,
      model_loaded_callback,
      allow_drag_and_drop: false,
      center_models: false,
      controls: 1,
      models: files.map((filename) => {return {filename: `../../assets/${filename}`}})
    }
  );
}