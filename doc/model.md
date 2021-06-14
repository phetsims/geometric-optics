# Geometric Optics - Model Description

The simulation describes light propagation through a lens in terms of rays. The
rays in geometric optics are useful abstraction useful for approximating the
paths along which light propagates.

The magnitude of the focal length of the lens is given by f= R/(2(1-n)))
where n and R are respectively the index of refraction and the radius of
curvature of the lens.

In the case of the mirror, the magnitude of the focal length is determined in
the paraxial approximation, i.e. given by f = R/2.

As for the sign, the focal length f is positive for converging optical
elements ( convex lenses and concave mirrors) and negative for diverging optical
elements ( concave lenses and convex mirrors)

For the lens, the position of the image is determined by the lens law which
states that 1/d_o + 1/d_i = 1/f where d_o is the distance to the object, d_i is
the distance to the image and f is the focal length of the optical element.

For lenses, the image distance d_i is positive for images on the far side of the
object (real images). If the image and object are on the same side of the lens,
the image distance is negative (and the image virtual).

A similar equation holds for mirrors, butw where the sign convention of the
distance is reversed. The image distance d_i is positive for images on the same
side of the object (real images). If the image is on the far side of the object,
the image distance is negative (and the image virtual).

The principal rays mode denote rays that help identify the position of the
image. The principal rays are not physical rays and at times fail to go through
a lens/mirror. Nevertheless, the method remains useful to find the location of
the image. The principal rays are defined by three rays:

- A ray from the top of the object proceeding parallel to the optical axis of
  the lens. Beyond the lens, it will pass through the principal focal point. For
  a negative lens, it will proceed from the lens as if it emanated from the
  focal point on the near side of the lens.
- A ray through the center of the lens, which will be undeflected.
- A ray through the principal focal point on the near side of the lens. It will
  proceed parallel to the centerline upon exit from the lens.

The marginal rays, also called rim rays, are the rays that start at the object
and touch the edge of the lens. The marginal rays emphasizes the limiting
aperture associated with an optical element.

The guides of the lens are meant to highlight the ability of lenses to bend
light. The internal angle of the guides is a property of the focal length of a
lens and its diameter. The guides are a useful approximation that allows to
approximately determine the position of the image without performing raytracing. 





The focal length of the lens is given by
f= R/(2(1-n))) where n and R are respectively the index of refraction and the radius of curvature of the lens. 

The focal length of the mirror is given by f = R/2. 

The focal length f is positive for converging optical element ( convex lenses 
and concave mirrors) and negative for diverging optical element ( concave lenses
and convex mirrors)

The image distance di is positive for real images and negative for virtual images.


The position of the image is determined in the thin lens approximation, i.e.
1/d_o+1/d_i = 1/f 
where d_o is the distance to the object, d_i is the distance to the image 
and f is the focal length of the optical element. 

The principal rays mode denote rays that help identify the position of the image. There are defined by three rays 

- A ray from the top of the object proceeding parallel to the optical axis of the lens. Beyond the lens, it will pass through the principal focal point. For a negative lens, it will proceed from the lens as if it emanated from the focal point on the near side of the lens.
- A ray through the center of the lens, which will be undeflected. 
- A ray through the principal focal point on the near side of the lens. It will proceed parallel to the centerline upon exit from the lens.

The marginal rays are the rays that start at the object and touch the edge of the lens.

The lenses are considered to be ideal and free of spherical and comatic aberrations.
