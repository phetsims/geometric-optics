# Geometric Optics - Model Description

@author Martin Veillette<br>
@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in PhET's _Geometric Optics_ simulation.

## Prerequisites

It's assumed that the reader is familiar with geometric optics.

## Model

Geometrical optics is a model of optics that describes light propagation in terms of rays. The rays in geometric optics are a useful abstraction for approximating the paths along which light propagates.

### Optics

This simulation supports two types of optics: lenses (convex, concave) and mirrors (convex, concave, flat). The lenses are considered to be ideal and free of spherical and comatic aberrations.

The mirror is modeled as a lens with index of refraction = 2. The flat mirror is modeled as a convex mirror with a very large radius of curvature (100000 cm).

The position of the optic is fixed at (0,0).

For the lens, magnitude of the focal length is given by `f = R/(2(1-n)))`, where `n` is the index of refraction, and `R` is the radius of curvature of the lens.

For the mirror, magnitude of the focal length is determined in the paraxial approximation, given by
`f = R/2`.

As for the sign, the focal length `f` is positive for converging optical elements (convex lenses and concave mirrors)
and negative for diverging optical elements (concave lenses and convex mirrors)

### Object

The position of the object is constrained such that it is always to the left of the optic.

To avoid problematic cases, the object is always at least 40 cm from the optic, and never more than 100 cm from the optical axis.

### Image

For the lens, the position of the image is approximated by the _thin lens equation_, which states that `1/d_o + 1/d_i = 1/f`, where `d_o` is the distance from the optic to the object, `d_i` is the distance from the optic to the image, and `f` is the focal length of the lens.

For lenses, the image distance `d_i` is positive for images to the right of the optic (real images), and negative for images to the left of the optic (virtual images).

A similar equation holds for mirrors, but where the sign convention of the distance is reversed. The image distance `d_i` is positive for images to the left of the optic (real images), and negative for images to the right of the optic (virtual images).

### Rays

"Principal" rays help identify the position of the image. The principal rays are not physical
rays and at times fail to go through the optic. Nevertheless, the method remains useful to find the location of the
image. For instance, for the lens, the principal rays are defined by three rays:

- A ray from the top of the object, proceeding parallel to the optical axis of the optical element. For a converging
  lens, the ray will pass through the principal focal point. For a diverging lens, the ray will proceed from the lens as
  if it emanated from the focal point on the near side of the lens.
- A ray through the center of the lens, which will be undeflected.
- A ray through the principal focal point on the near-side for a converging lens, or on the far-side for a diverging lens. The
  ray will proceed parallel to the optical axis upon exit from the lens.

"Marginal" rays, also called rim rays, are the rays that start at the object and touch the edges of the lens. The
marginal rays emphasize the limiting aperture associated with an optical element.

### _Lens_ screen

On the _Lens_ screen, the guides are meant to highlight the ability of lenses to bend light. The internal angle of the
guides is a property of the focal length of a lens and its diameter. Guides allow us to determine the (approximate) position 
of the image without performing ray tracing.

On the _Lens_ screen, sources of light can be projected onto a screen. The light spots that appears on the screen are based
on the aperture of the lens (i.e. its diameter) and the size of the light spot.
