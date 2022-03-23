# Geometric Options - Implementation Notes

@author Chris Malley (PixelZoom, Inc.)<br>
@author Martin Veillette

## Table of Contents
* [Introduction](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#introduction)
* [General Consideration](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#general-considerations)
    * [Model-View Transforms](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#model-view-transforms)
    * [Query Parameters](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#query-parameters)
    * [Memory Management](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#memory-management)
* [Optic](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#optic)
* [Optical Objects](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#optical-objects)
* [Optical Images](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#optical-images)
* [Projection Screen](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#projection-screen)
* [Rays](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#rays)
* [Guides](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#guides)
* [3D Perspective](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#3d-perspective)
* [Scenes](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#scenes)
* [Tools](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#tools)
* [Labels](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#labels)
* [Controls](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#controls)
* [Hollywood!](https://github.com/phetsims/geometric-optics/blob/master/doc/implementation-notes.md#hollywood!)

## Introduction

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

The first transform is a static mapping, see `modelViewTransform` in `GOScreenView`. The model has +x to the left, and +y up, and scaling is isometric in both directions. In the _Lens_ screen, the origin (0,0) in the model coordinate frame is near the center of the ScreenView. In the _Mirror_ screen, the origin is shift to the right, to accommodate the behavior of mirrors.

The second transform is a dynamic mapping, based on zoom level, see `zoomTransformProperty` in `GOScreenView`. This transform is applied to all all elements within a "scene" (optic, objects, images, rays, projection screen).

Rulers change their tick marks to match the zoom level, but otherwise do not change position or size. 

Labels change their position to match the zoom level, but otherwise do not change this size.

### Query Parameters

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented in
[GOQueryParameters.ts](https://github.com/phetsims/geometric-optics/blob/master/js/common/GOQueryParameters.ts).
Running with `?log` will print the complete set of query parameters (common-code, PhET-iO, and sim-specific)
to the browser console.

### Memory Management

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

The sim supports two types of optic, with multuple shapes: lens (concave, convex) and mirror (concave, convex, flat). A single optic instance is used for each screen, and that instance supports all of the shapes. 

A relatively complex part of the optic model implementation is that it supports 2 focal-length models:
* direct: focal length is settable, IOR is fixed, ROC is derived
* indirect: ROC and IOR are settable, focal length is derived

The user can switch between these focal-length models via radio buttons in the Options dialog.

The important classes are:

```
// model class heirachy
Optic
  Lens
  Mirror
  
FocalLengthModel
  DirectFocalLengthModel
  IndirectFocalLengthModel
  
// view class hierarchy
OpticNode
  LensNode
  MirrorNode
```

## Optical Objects

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

Framed images have variable opacity (see `opactityProperty` in `FramedImage`). We wanted to independently control how well the occluded parts of the optical axis and rays could be seen through the image. So an additional mask was added behind the image. See `FramedImageMaskNode`. 

## Projection Screen

As mentioned in the **Optical Images** section, lights form no optical image. Instead, they cast light spots on a projection screen.  

The important classes are:

```
// model
ProjectionScreen
LightSpot

// view
ProjectionScreen Node
LightSpotNode
```

## Rays

Light rays propagate from a point on an optical object, and interact with the optic. In the case of arrows and framed objects, an optical image is formed. In the case of lights, light spots appear where the rays hit the projection screen.

This sim has a relatively complicated ray tracer, which is also responsible for animation of rays.

Important classes:

```
// model
LightRays - a bundle of light rays that propagate from a point on an optical object
LightRay - a single light ray
GORay - a subclass of dot.Ray2 that adds functionality

// view class hierachy
LightRaysNode - base class
  RealLightRaysNode - renders real rays as solid lines
  VirtualLightRaysNode - renders virtual rays as dashed lines
```

## Guides

Guides are a representation invented by PhET, and described in [model.md](https://github.com/phetsims/geometric-optics/blob/master/doc/model.md). The are hidden behind query parameter `addGuidesCheckbox`.

The important classes are:

```
// model
Guide - a single guide
Guides - a pair of guides

// view
GuideNode - a single guide
GuidesNode - a pair of guides
```

## 3D Perspective

Since the framed objects/images have 3D perspective, we want the the optical axis and rays to look like they are passing through the object/images. This accomplish by drawing 2 copies of the axis and real rays, one behind the objects/images and one in front of the objects/images.  The copy in front uses a `clipArea` to shown only the parts of the axis and rays that are in front - see `OpticalAxisForegrondNode` and `RealLightRaysForegroundNode`.

The projection screen also has 3D perspective. To make the optical axis look like it passes through the screen, we similarly draw copies of the axis in front of and behind the screen.  A `clipArea` is not necessary, and the front axis is simply stops at where it meets the center of the screen. See `OpticalAxisInFrontOfProjectionScreenNode`.

## Scenes

There is one scene for each type of optical object (arrow, framed object, light). Things that are the responsibility of a scene include:
* optical objects
* optical images
* light rays
* focal points & 2F points
* optical axis
* projection screen & light spots
* guides

A single optic instance (lens or mirror) is shared by all scenes, as are the controls and tools.    

The important classes are:

```
// model class hierarchy
GOScene
  ArrowScene
  FramedObjectScene
  LightScene

// view class hierarchy
GOSceneNode
  ArrowSceneNode
  FramedObjectSceneNode
  LightSceneNode
```

Making a selection from `OpticalObjectComboBox` may or may not result in changing the scene. If switching between framed objects, the scene does not change, only the PNG files used for the framed object. For example, switching from "Pencil" to "Arrow" will switch from `FramedObjectScene` to `ArrowScene`. Switching from "Pencil" to "Penguin" will not change the scene, but will change from pencil PNG files to penguin PNG files for the optical object and image in `FramedObjectScene`.

## Tools

The sim has two types of tools: rulers and position markers. Two instances of each tool (model and view) are instantiated when the sim starts, and exist for the lifetime of the simulation. There is no dynamic creation of tools.  One set of tools is shared by all scenes. The tools do not change position when switching scenes, or when zooming in/out.

Tools live in a toolbox, see `GOToolbox` and `GOToolboxNode`. Tools move in and out of the toolbox via `isInToolboxProperty`, defined in `GOTool`.

See `js/common/model/tools/` and `js/common/view/tools/` for all source code related to tools.  

See `GOToolDragListener` for mouse/touch drag handling, `GOToolKeyboardDragListener` for keyboard drag handling.

Tools support 2 hotkeys (keyboard shortcuts):
* `ESCAPE` returns the tool to the toolbox
* `J` jumps (moves) the tool to "interesting points", cycling through those points from left-to-right

The "jump" hotkey is relatively complicated. A list of interesting points is provided by the scene, see `toolJumpPoints` and `opticJumpPoints`).  Each tool filters the list of points, then handles jumping to the next point, see `jumpToPoint`.  Since each scene has a list of points, and one set of tools is shared by all scenes, the list of points must be set when the scene changes, see `setJumpPoints`.

## Labels

The Labels feature shows labels for things of interest in a scene. Each scene has an associated set of labels, made visible when that scene is selected (if the "Labels" checkbox is checked).  Those "collection" classes are:

```
GOLabelsNode
  ArrowLabelsNode
  FramedObjectLabelsNode
  LightLabelsNode
```

When the thing that a label is associated with is not visible, the label is not visible.  When zooming in/out, a label moves with the thing that its labeling, but does not change change its scale (i.e. font size remains constant).

See `js/common/view/labels/` for all source code related to the Labels feature.

## Controls

Most of the controls are straightforward, nothing too challenging in the implementation. From top-to-bottom, left-to-right as they appear in the UI, here are the classes for the controls:

```
OpticalObjectChoiceComboBox - combo box for selecting optical object
ObjectDragModeToggleButton - toggle button used to lock dragging to horizontal
OpticShapeRadioButtonGroup - radio buttons for choosing the shape of the optic
zoomButtonGroup - zoom buttons, in GOScreenView.ts
LightPropagationToggleButton - toggle button for turning light propagation on/off
GOControlPanel - the main control panel
```

For controls that appear in the Options dialog, start with `GOGlobalOptionsNode.ts`.

## Hollywood!

To write well-behaved programs, it's not always possible to be physically accurate. This section enumerates the places where we have "Hollywooded" things to provide close approximations and convincing behavior.

* Physical mirrors do not have an index of refraction. Our mirror is modeled as a lens with index of refraction = 2. See `INDEX_OF_REFRACTION_RANGE` in `Mirror.ts`.

* A flat mirror is modeled as a convex mirror with very large focal length. See `FLAT_MIRROR_FINITE_FOCAL_LENGTH` in `Optic.ts`. PhET-iO clients should therefore be warned that model Properties are not accurate for the flat mirror. For example, focal length will be a very large number, not infinity.
  
* The shape of the lens, as well as the refraction of the rays within the lens, is "Hollywooded". This leads to a few artifacts that we have attempted to minimize. See the `isHollywooded` option to `LensShapes.ts`.

* To ensure that rays pass through the optic, the optical object is always at least 40 cm from the optic, and never more than 100 cm from the optical axis. See `MIN_DISTANCE_FROM_OBJECT_TO_OPTIC` and `MAX_DISTANCE_FROM_OBJECT_TO_OPTICAL_AXIS` in `GOConstants.ts`.

* To ensure that at least 2 rays pass through the optic, the "Many" mode for Rays dynamically varies the number of rays based on the object's distance from the object. See `'many'` in `LightRays.ts`.

* The opacity of framed images is derived from several quantities and magic numbers. See `opactityProperty` in `FramedImage`. 
