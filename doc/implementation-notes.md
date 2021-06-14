## Implementation Notes

Ths document is meant and to supplement the source code and comments of the simulation Geometric Optics.

Since the language of optics is confusing and share a lot of overlap with language in software development,
it is worthwhile to define some terms uses throughout the simulation.

Object:  
 Anything that can be views.

Image:
 The likeness of an object produced at a point in space by a lens or a mirror

Real image:
 An image for which light rays physically intersect at the image location. 

Virtual Image:
 A image for which light rays do not physically intersect at the image point but appears to diverge from that point.

Real Rays:
 Light rays emanating from an object and reflected/transmitted by an optical element

Virtual Rays:
 Backward rays that indicate an apparent origin for ray the divergence of rays.
Virtual rays are drawn from an optical element to the position of a virtual image. 

Optical Axis:
The straight line passing through the center of curvature and pole of  
optical element. It is also called its principal axis.

First Principal Focus:
A beam of light incident parallel to the optical axis, after reaching the optical element will either actually
converge to or appear to diverge from a fixed point on the optical axis. The fixed point is called the ‘First
Principal focus’.

Second Principal Focus:
The point opposite to the first principal focus from the optical element.

Guide:


**Model-view transform**: This simulation has a model-view transform that maps from the model coordinate frame to the
view coordinate frame. The origin (0,0) in the model coordinate frame at the center of the view screen. The scaling is
isometric along the vertical and horizontal directions.

**Memory management**: Unless otherwise documented in the source code, assume that `unlink`, `removeListener`, `dispose`
, etc. are generally not needed. All listeners exist for the lifetime of the sim.

The main model class is [GeometricOpticsModel](https://github. com/phetsims/geometric-optics/blob/master/js/common/model
/GeometricOpticsModel.js).

The simulation uses a model view transform for the play area. The visibility of all elements is controlled by the view.

All the properties in the simulation are created at startup. The listeners to the properties exist for the lifetime of
the simulation and do not need to be disposed.

There are a few top-level model elements in Common Model:

* [Lens] is responsible for the lens position, diameter, curvature radius and refractive index. The previous properties
  are used to determine the focal length.
* [TargetImage]
* [SourceObject]
* [LightRays]
* [Guides]

There are a few top-level model elements in Common Screen:

* [LensNode] is responsible for the lens
* [FocalPointNode] lays out the focal point.
* [TargetImageNode] is
* [SourceObjectNode] is the
* [LightRaysNode]
* [GuidesNode]
* [ProjectorScreenNode]
* [ControlPanel]
