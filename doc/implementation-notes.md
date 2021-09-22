# Geometric Options - Implementation Notes

Ths document is meant and to supplement the source code and comments of the simulation Geometric Optics.

## Terminology 

Since the language of optics is confusing, and terms overlap with those used in software development, it is
worthwhile to define some terms uses throughout the simulation.

**Object:**  
Anything that can be viewed. Unfortunately this term conflicts with JavaScript's `Object` type, so we 
use **SourceObject** in the code.

**Image:**
The likeness of an object produced at a point in space by a lens or a mirror.
Unfortunately this term conflicts with `SCENERY/Image` so we use the term **Target** in the code.

**Real image:**
An image for which light rays physically intersect at the image location.

**Virtual Image:**
A image for which light rays do not physically intersect at the image point but appears to diverge from that point.

**Real Rays:**
Light rays emanating from an object that are reflected/transmitted by an optical element

**Virtual Rays:**
Backward rays that indicate an apparent origin for the divergence of rays. Virtual rays are drawn from an optical
element to the position of a virtual image.

**Optical Axis:**
The straight line passing through the center of curvature and pole of  
an optical element. It is also called the "principal axis".

**First Principal Focus:**
A beam of light incident parallel to the optical axis, after reaching the optical element, will either actually converge
to or appear to diverge from a fixed point on the optical axis. The fixed point is called the "First Principal focus".

**Second Principal Focus:**
The point opposite to the first principal focus from the optical element.

**Guide:**
This is a PhET construction, but is used in the simulation to denote the bending of the light due to a lens. A guide
is attached to the ends of the lens and can freely rotate from its fulcrum point.

**Screen:**
Light is projected onto a screen. Unfortunately this term conflicts with `SCENERY/Screen`. So we use _ProjectorScreen_ throughout the code.

**Play Area:** This simulation creates a scenery layer called **play area** that is used all the elements within the "Play Area". In essence,
it includes all the scenery elements except for the control panels, combox box, buttons, etc. The play area can be
zoomed in or out. It is important to note that the rulers and the labels do not belong to the play area since they
contain text that may be hard to read upon zooming. Therefore, like the control panels and buttons, they are attached
directly to the ScreenView.

**positive/negative**: The meaning of positive and negative is a convention that may
vary. We define the convention followed in the simulation in [model.md](https://github.com/phetsims/geometric-optics/blob/master/doc/model.md). 

**distance**: In optics, a distance is always measured horizontally, and can be positive or negative. 

**height**: The height in optics is always measured from the optical axis. A positive (negative) height indicates the object is above (below) the optical axis.

## General Considerations

### Model-view transform and Zoom

This simulation makes use of model view transform to map model coordinates to the
view coordinates. The base units of the model is centimeters (cm). It is used throughout the model with a few exceptions
that have been noted. A model view transform is applied to all elements within the play area. All elements within the
play area can be scaled up and down by scaling the playArea node. The origin (0,0) in the model coordinate frame is near
the center of the view screen. The model to view scaling is isometric along the vertical and horizontal directions.

For scenery nodes outside the playArea, we lay them out using the view coordinates. There are two exceptions to this: (

1) The `LabelsNode`, responsible for labels beneath the optical components and (2) the `GeometricOpticsRulerNode`. The
   labels and ruler use `zoomModelViewTransformProperty` which allows it to relate its coordinate to within the play
   area at this particular zoom level.

The nodes within the play area may need to know about the position of objects outside the play area, such as the bounds
of the simulation. For instance, the `zoomModelViewTransform` can be used to convert the visibleBounds of the simulation
to `playAreaModelBounds`.

### Memory management

Unless otherwise documented in the source code, assume that `unlink`, `removeListener`, `dispose`
, etc. are generally not needed and that all listeners exist for the lifetime of the sim.

# Model

The main model class
is [GeometricOpticsModel](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/GeometricOpticsModel.js)
.

There are a three top-level model elements in GeometricOpticsModel that play an essential role, namely `SourceObject`
, `Optic` and `Target`. This trifecta of elements rules the entire simulation. Each of them is a component of the
thin-lens and mirror equation. It is important to note that all the light rays do not drive the model, but take their
marching orders from the trifecta.

* [SourceObject](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/SourceObject.js) is
  responsible for the first object/source position as well as the bounds of the object/source. It is also includes a
  second object/source position.
* [Optic](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Optic.js) is responsible for the
  optical element position, diameter, curvature radius and refractive index. The previous properties are used to
  determine the focal length. Optic is also responsible for the shape of the optical element, which can be used for ray
  hit-testing, as well as drawing its shape.
* [Target](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Target.js) is responsible for the
  position of the target, its bounds and scale. It includes multiple methods that determine if the target is
  real/virtual, inverted/upright, etc.

The client can select from the combox box what we refer to as a representation of the object/source.

* [Representation](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Representation.js) is the
  class responsible for the representation of the object and target. The representation provide a map to images with
  different orientations that can be used to display source/object images and target images as well as the image logo.
  The position of "interesting" points within images is defined in the representation.

Light rays form an important aspect of this simulation. There are three model classes responsible for the rays:

* [Ray](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Ray.js) is a representation of a
  finite, or semi-infinite straight rays. A ray can only be straight, not refracted. Note that `Ray` extends `dot/Ray2`.
* [LightRay](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/LightRay.js) is a representation
  of a ray emanating from a source or object. `LightRay` has a time dependencies. A `LightRay` can be refracted or
  reflected from an optical element. It can even fork into a virtual and real ray. A `LightRay` is usually composed of one or more
  `Rays`. A `LightRay` converts its rays at that point in time into `kite/Shape`. It can indicate if it has reached a target
  or the projector screen.
* [LightRays](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/LightRays.js) is a representation
  of a bundle of light rays. LightRays depends on the `RayMode`. The bundle of light rays emerge from a single
  object/source position. An additional responsibility of LightRays is to indicate if one of its ray has reached a
  target, or projector screen.

We note that each light ray depends on the trifecta (SourceObject, Optic and Target) and their path is determined based
on this information. This insures that all rays can converge to the same target.

# View

There are a few top-level model elements in GeometricOpticsScreenView:

* [OpticNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/OpticNode.js) is responsible for
  the optical element (Lens or Mirror).

* [TargetNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/TargetNode.js) is the scenery
  node for the optical image.

* [SourceObjectNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/SourceObjectNode.js) is the
  node responsible for the first source/object and the second source/object.

* [LightRaysNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/LightRaysNode.js) is
  responsible for laying out the light rays.

Except for the `GeometricOpticsRulerNode`, all scenery Nodes are created at startup. 

Properties in [VisibileProperties](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/VisibleProperties.js) are used to toggle the visibility of Nodes.

## Gotchas

There a few odd things.

* Since LightRays have a dependency on the `projectorScreen`, the `projectorScreen` model is instantiated within the
  common model. However, we note that there is no counterpart `ProjectorScreenNode` within the `MirrorScreen` since the
  mirror screen does not have a light source representation.
* The `Optic` model takes an index of refraction has a parameter. Physical mirror do not have an index of refraction,
  but for the purposes of the simulation, we can make our model mirror to be functionally equivalent to a lens with an
  index of refraction of 2.
* The shape of the lens as well as the refraction of the rays within the lens is hollywooded. This leads to a few
  artefacts that we attempted to minimize, but unfortunately complicates the codebase.
* There is a not a one-to-one correspondence between the model instances and view instances.
    - There is one instance of opticNode that depends on one optic model (so far so good).
    - There is one instance of targetNode that depends on the firstTarget model. The secondTarget model does not have a
      targetNode component but is used by the secondLightRay and projectorScreen.
    - There is one objectSourceNode and one objectSource model. The position of the first and second source are embedded
      within the `objectSourceModel`.
