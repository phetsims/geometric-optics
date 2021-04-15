## Model

This section provides a quick overview of the model.

The main model class is [GeometricOpticsModel](https://github.
com/phetsims/geometric-optics/blob/master/js/common/model
/GeometricOpticsModel.js). 

There are a few top-level model elements in Common Model:

* [Lens] is responsible for the lens position, diameter, curvature 
  radius and refractive index. The previous properties are used to 
  determined the focal length.
* [TargetImage] 
* [SourceObject] 
* [LightRays]
* [Guides]


There are a few top-level model elements in Common Screen:

* [ScreenViewNode]
* [LensNode] is responsible laying the lens
* [FocalPointsNode] lays out the focal points, and the optical axis.
* [TargetImageNode] is 
* [SourceObjectNode]
* [LightRaysNode]
* [GuidesNode]   
* [ScreenNode]
* [LensControlPanel]
* [ControlPanel]
