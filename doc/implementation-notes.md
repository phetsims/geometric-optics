## Model

This section provides a quick overview of the model.


Pole:
It is the center of the surface of the concave mirror also called vertex of mirror.


Center of curvature:
It is the center of that sphere of which the curved mirror forms a part, denoted by letter ‘C’.

Principal axis:
The straight line passing through the center of curvature and pole of  
optical element is called its principal axis.

First Principal focus:
A beam of light incident parallel to the principal axis, after reaching the
optical element will either actually converge to or appear to diverge
from a fixed point on the principal axis. The fixed point is called the
‘First Principal focus’.

Second Principal focus:
The point opposite to the first principal focus from the optical element.

Types of images:
1)    Real image: If the rays that emerge from the optical element  actually
      meet at a point, then the
      image formed is real. It can be obtained on screen.
2)    Virtual Image: If the rays that emerge from the optical element do not
      actually meet at a point but appear to diverge from a point, then the image formed is virtual.


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
  determine the focal length.
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
