## Model

This section provides a quick overview of the model.



**Model-view transform**: This simulation has a model-view transform that 
maps from the model coordinate frame to the view coordinate frame. 
The origin (0,0) in the model coordinate frame at the center of the 
view screen. The scaling is isometric along the vertical and horizontal 
directions. 

**Memory management**: Unless otherwise documented in the source code, 
assume that `unlink`, `removeListener`, `dispose`, etc. are generally not 
needed. All listeners exist for the lifetime of the sim. 


The main model class is [GeometricOpticsModel](https://github.
com/phetsims/geometric-optics/blob/master/js/common/model
/GeometricOpticsModel.js). 

The simulation uses a model view transform for the play area.
The visibility of all elements is controlled by the view. All 

All the properties in the simulation are created
The listeners to the properties exist for the lifetime of the simulation 
and do not need to be disposed.

There are a few top-level model elements in Common Model:

* [Lens] is responsible for the lens position, diameter, curvature 
  radius and refractive index. The previous properties are used to 
  determined the focal length.
* [TargetImage] 
* [SourceObject] 
* [LightRays]
* [Guides]


There are a few top-level model elements in Common Screen:

* [LensNode] is responsible for the lens
* [FocalPointsNode] lays out the focal points, and the optical axis.
* [TargetImageNode] is 
* [SourceObjectNode] is the 
* [LightRaysNode]
* [GuidesNode]   
* [ProjectorScreenNode]
* [ControlPanel]
