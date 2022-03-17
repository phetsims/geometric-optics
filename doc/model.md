# Geometric Optics - Model Description

@author Martin Veillette<br>
@author Chris Malley (PixelZoom, Inc.)

This document is a high-level description of the model used in PhET's _Geometric Optics_ simulation.

## Prerequisites

It's assumed that the reader is familiar with geometric optics.

## Model

Geometrical optics is a model of optics that describes light propagation in terms of rays. The rays in geometric optics are a useful abstraction for approximating the paths along which light propagates.

This simulation supports two types of optics: lenses (convex, concave) and mirrors (convex, concave, flat).

The magnitude of the focal length of the lens is given by `f = R/(2(1-n)))`
where `n` is the index of refraction, and `R` is the radius of curvature of the lens.

In the case of a mirror, the magnitude of the focal length is determined in the paraxial approximation, i.e. given by
`f = R/2`.

As for the sign, the focal length `f` is positive for converging optical elements (convex lenses and concave mirrors)
and negative for diverging optical elements (concave lenses and convex mirrors)

For the lens, the position of the image is determined by the lens law, which states that `1/d_o + 1/d_i = 1/f`
where `d_o` is the distance to the object, `d_i` is the distance to the image and `f` is the focal length of the optical
element.

For lenses, the image distance `d_i` is positive for images on the far side of the object (real images). If the image
and object are on the same side of the lens, the image distance is negative (virtual images).

A similar equation holds for mirrors, but where the sign convention of the distance is reversed. The image
distance `d_i` is positive for images on the same side of the object (real images). If the image is on the far side of
the object, the image distance is negative (virtual images).

The "principal" ray mode denotes rays that help identify the position of the image. The principal rays are not physical
rays and at times fail to go through the lens/mirror. Nevertheless, the method remains useful to find the location of the
image. For instance, for the lens, the principal rays are defined by three rays:

- A ray from the top of the object, proceeding parallel to the optical axis of the optical element. For a converging
  lens, the ray will pass through the principal focal point. For a diverging lens, the ray will proceed from the lens as
  if it emanated from the focal point on the near side of the lens.
- A ray through the center of the lens, which will be undeflected.
- A ray through the principal focal point on the near-side for a converging lens, or on the far-side for a diverging lens. The
  ray will proceed parallel to the optical axis upon exit from the lens.

The "marginal rays", also called rim rays, are the rays that start at the object and touch the edge of the lens. The
marginal rays emphasize the limiting aperture associated with an optical element.

On the _Lens_ screen, the guides are meant to highlight the ability of lenses to bend light. The internal angle of the
guides is a property of the focal length of a lens and its diameter. Guides allow us to determine the (approximate) position 
of the image without performing raytracing.

On the _Lens_ screen, sources of light can be projected onto a screen. The spotlight that appears on the screen is based
on the aperture of the lens (i.e. its diameter) and the size of the spotlight.

The lenses in the simulation are considered to be ideal and free of spherical and comatic aberrations.
