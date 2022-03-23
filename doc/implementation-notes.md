# Geometric Options - Implementation Notes

@author Chris Malley (PixelZoom, Inc.)<br>
@author Martin Veillette

---

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

The first transform is a static mapping, see `modelViewTransform` in [GOScreenView.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/GOScreenView.ts). The model has +x to the left, and +y up, and scaling is isometric in both directions. In the _Lens_ screen, the origin (0,0) in the model coordinate frame is near the center of the ScreenView. In the _Mirror_ screen, the origin is shift to the right, to accommodate the behavior of mirrors.

The second transform is a dynamic mapping, based on zoom level, see `zoomTransformProperty` in [GOScreenView.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/view/GOScreenView.ts). This transform is applied to all all elements within a "scene" (optic, objects, images, rays, projection screen).

Rulers change their tick marks to match the zoom level, but otherwise do not change position or size. 

Labels change their position to match the zoom level, but otherwise do not change this size.

### Query Parameters

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented in
[GOQueryParameters.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/GOQueryParameters.ts).
Running with `?log` will print the complete set of query parameters (common-code, PhET-iO, and sim-specific)
to the browser console.

### Memory management

* **Dynamic allocation:** Most objects in this sim are allocated at startup, and exist for the lifetime of the simulation. The exception is GOOptionsDialogNode.ts and its children, which must all implemented `dispose`. This is the content for the Options dialog, and is instantiated each time the Options menu item is selected from the PhET menu.

* **Listeners**: Unless otherwise noted in the code, all uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink`, `removeListener`, etc.

* **dispose**: All classes have a `dispose` method. Sim-specific classes whose instances exist for the lifetime of the sim are not intended to be disposed, and their `dispose` implementation looks like this:

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

## Optic

The sim supports two types of optic: lens (concave, convex) and mirror (concave, convex, flat). The important classes are:

```
// model class heirachy
Optic
  Lens
  Mirror

// view class hierarchy
OpticNode
  LensNode
  MirrorNode
```

## Optical Object

In geometric optics, an **object** is anything that can be viewed. Since that term conflicts with the name of JavaScript's `Object` class, we use **optical object** in the code where there is potential for confusion.

Three types of optical object are implemented in this sim: 
* **Arrow**: the most common representation used in geometric optics courses. The arrow is drawn perpendicular to the optical axis, and its tail is always on the optical axis.
* **Framed Object**: an object shown in a picture frame, in 3D perspective. The 3D perspective presents some additional implementation challenges, which we'll discuss in the **3D Perspective** section.
* **Light**: point light sources

`OpticalObjectChoice` is a rich enumeration of optical objects. While there are 3 choices of framed object (Pencil, Penguin, Star), those choices simply change the PNG files used to represent the single framed object.  `OpticalObjectChoiceComboBox`, in the upper-right corner of the screen, is used to select one of the value from `OpticalObjectChoice`.

Important classes for the optical object are:

```
// model class heirachy
OpticalObject
  ArrowObject
  FramedObject
  LightObject

// view class hierarchy:
OpticalObjectNode
  ArrowObjectNode
  FramedObjectNode
  LightObjectNode
```

## Optical Images

In geometric optics, an **image** is the likeness of an object produced at a point in space by an optic. Since that term conflicts with the name of PhET's `scenery.Image` class, we use **optical image** in the code where there is potential for confusion.

Arrows and framed objects have associated optical images; lights do not.  So the important classes are:

```
// model class hierarchy
OpticalImage
  ArrowImage
  FramedImage

// view class hierarchy
OpticalImageNode
  ArrowImageNode
  FramedImageNode
```

## Projection Screen & Light Spots

As mentioned in the **Optical Images** section, Lights form no optical image. Instead, they cast light spots on a projection screen.  The important classes are:

```
// model
ProjectionScreen
LightSpot

// view
ProjectionScreen Node
LightSpotNode
```

## 3D Perspective

Since the framed objects/images have 3D perspective, we want the the optical axis and rays to look like they are passing through the object/images. This accomplish by drawing 2 copies of the axis and real rays, one behind the objects/images and one in front of the objects/images.  The copy in front uses a `clipArea` to shown only the parts of the axis and rays that are in front - see `OpticalAxisForegrondNode` and `RealLightRaysForegroundNode`.

The projection screen also has 3D perspective. To make the optical axis look like it passes through the screen, we similarly draw copies of the axis in front of and behind the screen.  A `clipArea` is not necessary, and the front axis is simply stops at where it meets the center of the screen. See `OpticalAxisInFrontOfProjectionScreenNode`.

# Hollywood!

To write well-behaved programs, it's not always possible to be physically accurate. This section enumerates the places where we have "Hollywooded" things to provide close approximations and convincing behavior.

* Physical mirrors do not have an index of refraction. Our mirror is modeled as a lens with index of refraction = 2. See `INDEX_OF_REFRACTION_RANGE` in [Mirror.ts](https://github.com/phetsims/geometric-optics/blob/master/js/mirror/model/Mirror.ts).

* A flat mirror is modeled as a convex mirror with very large focal length. See `FLAT_MIRROR_FINITE_FOCAL_LENGTH` in [Optic.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/Optic.ts). PhET-iO clients should therefore be warned that model Properties are not accurate for the flat mirror. For example, focal length will be a very large number, not infinity.
  
* The shape of the lens, as well as the refraction of the rays within the lens, is "Hollywooded". This leads to a few artifacts that we have attempted to minimize. See the `isHollywooded` option to [LensShapes.ts](https://github.com/phetsims/geometric-optics/blob/master/js/lens/model/LensShapes.ts).

* To ensure that rays pass through the optic, the optical object is always at least 40 cm from the optic, and never more than 100 cm from the optical axis. See `MIN_DISTANCE_FROM_OBJECT_TO_OPTIC` and `MAX_DISTANCE_FROM_OBJECT_TO_OPTICAL_AXIS` in [GOConstants.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/GOConstants.ts).

* To ensure that at least 2 rays pass through the optic, the "Many" mode for Rays dynamically varies the number of rays based on the object's distance from the object. See `'many'` in [LightRays.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/model/LightRays.ts).
