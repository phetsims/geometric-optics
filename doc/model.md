# Geometric Optics - Model Description

@author Martin Veillette<br>
@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in PhET's _Geometric Optics_ simulation.

It's assumed that the reader is familiar with geometric optics. Geometric optics is a model of optics that describes light propagation in terms of rays. Rays are a useful abstraction for approximating the paths along which light propagates.

## Terminology

Since the language of optics is confusing, and terms overlap with those used in software development, it is
worthwhile to define some terms used throughout the simulation.

**Optic**: an optical element or optical component in an optical instrument or system (e.g. lens, mirror)

**Optical Axis:** The horizontal axis passing through the center of curvature and pole of an optical element. It is also called the "principal axis".

**Object:**  Anything that can be viewed. Since this term conflicts with the name of JavaScript's `Object` class, we use **Optical Object** in the code.

**Image:** The likeness of an object produced at a point in space by an optic.
Since this term conflicts with the name of PhET's `scenery.Image` class, we use **Optical Image** in the code.

**Real image:** An image for which light rays physically intersect at the image location.

**Virtual Image:** An image for which light rays do not physically intersect at the image point but appears to diverge from that point.

**Screen**: A surface perpendicular to the optical axis, onto which light is projected. Since this term conflicts with the name of PhET's `joist.Screen` class, we use **ProjectorScreen** in the code.

**First Principal Focus:** A beam of light incident parallel to the optical axis, after reaching the optical element, will either actually converge to or appear to diverge from a fixed point on the optical axis. This fixed point is called the "first principal focus".

**Second Principal Focus:** The point opposite to the first principal focus from the optic.

**distance**: In optics, a distance is always measured parallel to the optical axis, and can be positive or negative. 

**height**: In optics, a height is always measured from (and perpendicular to) the optical axis. A positive (negative) height indicates the object is above (below) the optical axis.

**Guide:** A representation invented by PhET, used to denote the bending of the light due to a lens. A guide is attached to the top or bottom extrema of the lens, and can freely rotate from its fulcrum point.

## Abbreviations

_f_ = focal length

_F_ = focal point, at a distance _f_ from the optic

_n, IOR_ = index of refraction

_R, ROC_ = radius of curvature

_d<sub>o</sub>_ = distance from the optic to the object

_d<sub>i</sub>_ = distance from the optic to the image

## Optics (Lens and Mirror)

This simulation supports two types of optics: lens (convex, concave) and mirror (convex, concave, flat). The lens is considered to be ideal, and free of spherical and comatic aberrations.

The mirror is modeled as a lens with index of refraction = 2. The flat mirror is modeled as a convex mirror with a very large focal length (100,000 cm).

The position of the optic is fixed at (0,0).

The radius of curvature is identical for both surfaces of our optics.

For the lens, magnitude of the focal length is given by the _lens-maker's equation_, _f = R/(2(1-n))_. For the mirror, magnitude of the focal length is determined by the paraxial approximation, given by _f = R/2_. As for the sign, the focal length _f_ is positive for converging optics (convex lens, concave mirror) and negative for diverging optics (concave lens, convex mirror).

A lens has two focal points (F) and two 2F points, while a mirror only has one surface, and therefore
only one F point and one 2F point.  This difference is correctly reflected in the view for this simulation.
But as an implementation simplification, the model has two F points and two 2F points for both types of optics
(lens and mirror). More specifically for this simulation:
* For a lens, F and 2F points appear on both sides of the lens.
* For a concave mirror, F and 2F appear to the _left_ of the mirror.
* For a convex mirror, F and 2F appear to the _right_ of the mirror.
* For a flat mirror, F and 2F are at infinity, so are not visible in the simulation.

## Object

The position of the object is constrained such that it is always to the left of the optic.

To avoid problematic cases, the object is always at least 40 cm from the optic, and never more than 100 cm from the optical axis.

## Image

The position of the image is approximated by the _thin lens equation_, given by _1/d<sub>o</sub> + 1/d<sub>i</sub> = 1/f_.

For lenses, the image distance _d<sub>i</sub>_ is positive for images to the right of the lens (real images), and negative for images to the left of the lens (virtual images).

A similar equation holds for mirrors, but the sign convention is reversed. The image distance _d<sub>i</sub>_ is positive for images to the left of the mirror (real images), and negative for images to the right of the mirror (virtual images).

For both lenses and mirrors, a positive image distance results in a real image, while a negative image distance results in a virtual image.

## Ray Tracing

Rays approximate the path of light, as it propagates from a point on an object. The simulation's ray tracer provides
three representations for rays: Marginal, Principal, and Many.

_Marginal_ rays, also called rim rays, are the rays that start at the object and touch the edges of the lens. The
marginal rays emphasize the limiting aperture associated with an optic.

_Principal_ rays help identify the position of the image. The principal rays are not physical
rays and at times fail to go through the optic. Nevertheless, the method remains useful to find the location of the
image. For instance, for the lens, the principal rays are defined by three rays:

- A ray through the center of the lens, which will be undeflected.
- A ray from the top of the object, proceeding parallel to the optical axis of the optic. For a converging lens, the ray will pass through the principal focal point. For a diverging lens, the ray will proceed from the lens as if it emanated from the focal point on the near side of the lens.
- A ray through the principal focal point on the near-side for a converging lens, or on the far-side for a diverging lens. The ray will proceed parallel to the optical axis upon exit from the lens.

_Many_ rays consists of a 120-degree fan of rays. The number of rays increases with the distance of the object from the
optic, so that at least two rays will pass through the optic. At least one ray (preferably two) must intersect the optic
in order to form an image.

## _Lens_ screen

The _Lens_ screen includes features not found on the _Mirror_ screen.

**Light sources**: Light sources can be projected onto a screen. Brightness of the light spots on the screen is based on the diameter of the lens and the diameter of the light spot.

**Guides**: Guides are a representation invented by PhET. They demonstrate the ability of lenses to bend light, and allow us to approximate the position of the image without performing ray tracing. The internal angle of the guides is a property of the focal length of the lens and its diameter. _NOTE: The Guides feature is disabled by default. Running the simulation with query parameter `addGuidesCheckbox=true` will add a "Guides" checkbox to the control panel._
