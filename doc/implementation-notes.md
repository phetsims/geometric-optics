# Geometric Options - Implementation Notes

@author Martin Veillette<br>
@author Chris Malley (PixelZoom, Inc.)

This document contains notes related to the implementation of _Geometric Optics_. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents). 

Before reading this document, please read:
* [model.md](https://github.com/phetsims/geometric-optics/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Geometric Optics HTML5](https://docs.google.com/document/d/1hVxM-ax2UyxctbclAhutrRad5A0eeLWKFQNB4U7ls4o/edit), the design document (which may be out of date)

## General Considerations

### Model-View Transforms

This simulation makes use of 2 model-view transforms to map model coordinates (in cm) to view coordinates.

The first transform handles the static mapping, see `const modelViewTransform` is GOScreenView.ts. The model has +x to the left, and +y up, and scaling is isometric in both directions. In the _Lens_ screen, the origin (0,0) in the model coordinate frame is near the center of the ScreenView. In the _Mirror_ screen, the origin is shift to the right, to accommodate the behavior of mirrors.

The second transform handles zooming, see `const zoomTransformProperty` in GOScreenView.ts. This transform is applied to all all elements within a "scene" (optic, objects, images, rays, projection screen).

### Memory management

* **Dynamic allocation:** Most objects in this sim are allocated at startup, and exist for the lifetime of the simulation. The exception is GOOptionsDialogNode.ts and its children, which must all implemented `dispose`. This is the content for the Options dialog, and is instantiated each time the Options menu item is selected from the PhET menu.

* **Listeners**: Unless otherwise noted in the code, all uses of `link`, `addListener`, etc. do NOT need a corresponding
  `unlink`, `removeListener`, etc.

* **dispose**: Most sim-specific classes are not intended to be disposed, and therefore do not properly implement
`dispose`.  Those classes will either have no `dispose` method, or will override their interited `dispose`
method like this:

```js
/**
 * @public
 * @override
 */
dispose() {
  assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  super.dispose();
}
```

# Model

The main model class
is [GOModel](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/GeometricOpticsModel.js)
.

There are a three top-level model elements in GOModel that play an essential role, namely `FramedObject`
, `Optic` and `FramedImage`. This trifecta of elements rules the entire simulation. Each of them is a component of the
thin-lens and mirror equation. It is important to note that all the light rays do not drive the model, but take their
marching orders from the trifecta.

* [FramedObject](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/SourceObject.js) is the first
  object/source.
* [SecondPoint](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/SecondSource.js) is the second
  object/source.
* [Optic](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Optic.js) is the optic, a lens or
  mirror. It is responsible for the optical element position, diameter, curvature radius and refractive index. The
  previous Properties are used to determine the focal length. Optic is also responsible for the shape of the optical
  element, which can be used for ray hit-testing, as well as drawing its shape.
* [FramedImage](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Target.js) is the optical image (real or vitual). It is responsible for the
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

We note that each light ray depends on the trifecta (FramedObject, Optic and FramedImage) and their path is determined based
on this information. This insures that all rays can converge to the same target.

# View

There are a few top-level view elements:

* [OpticNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/OpticNode.js) renders
  the optical element (Lens or Mirror).
* [FramedObjectNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/SourceObjectNode.js) renders framed objects.
* [SecondPointNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/SecondSourceNode.js) renders the second point-of-interest on a framed object.
* [FramedImageNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/FramedImageNode.js) renders
  the optical image associated with a framed object.
* [RealLightRaysNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/RealLightRaysNode.js) and 
[VirtualLightRaysNode](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/VirtualLightRaysNode.js)
  render real and virtual light rays respectively.

Properties in [VisibileProperties](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/VisibleProperties.js) are used to toggle the visibility of Nodes.

## Gotchas

There a few odd things.

* Since LightRays have a dependency on the `projectorScreen`, the `projectorScreen` model is instantiated within the
  common model. However, we note that there is no counterpart `ProjectionScreenNode` within the `MirrorScreen` since the
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
