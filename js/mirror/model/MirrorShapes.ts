// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorShapes is the set of Shapes that describe a mirror. All Shapes are in model coordinates.
 *
 * Designed as a first surface mirror (or front surface mirror), which is a mirror with the reflective surface being
 * above a backing. This is as opposed to a conventional, second surface mirror, with the reflective surface behind
 * a transparent substrate such as glass or acrylic.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OpticShapes from '../../common/model/OpticShapes.js';
import geometricOptics from '../../geometricOptics.js';

type SelfOptions = {
  backingThickness?: number; // thickness of the backing of the mirror, in cm
};

type MirrorShapesOptions = SelfOptions;

export default class MirrorShapes implements OpticShapes {

  // specific to MirrorShapes
  public readonly reflectiveCoatingShape: Shape; // reflective coating on the front (left-facing) surface of the mirror, with zero area
  public readonly backingShape: Shape; // the mirror's backing

  // See OpticShapes
  public readonly frontShape: Shape; // the mirror's reflective coating
  public readonly backShape: null; // rays do not pass through a mirror, so there is no hit testing on its back
  public readonly activeBoundsShape: Shape; // the mirror's reflective coating

  /**
   * @param radiusOfCurvature - radius of curvature (ROC) at the center of the mirror
   * @param diameter - height of the mirror, width is foreshortened to provide 3D perspective
   * @param providedOptions
   */
  public constructor( radiusOfCurvature: number, diameter: number, providedOptions?: MirrorShapesOptions ) {

    const options = optionize<MirrorShapesOptions, SelfOptions>()( {

      // MirrorShapesOptions
      backingThickness: 5 // thickness of the backing of the mirror, in cm
    }, providedOptions );

    const sign = Math.sign( radiusOfCurvature );
    const magnitude = Math.abs( radiusOfCurvature );
    assert && assert( magnitude > diameter / 2 );

    // convenience variable
    const backingThickness = options.backingThickness;

    // convenience variable
    const halfHeight = diameter / 2;

    // half of the width of the outline shape of the mirror along the x -axis
    const halfWidth = magnitude - Math.sqrt( magnitude ** 2 - halfHeight ** 2 );

    // top and bottom surfaces of fill shape must be tilted to generate right angle corners
    const angle = Math.atan( halfHeight / magnitude );

    // vector offset between the two top corners and bottom corners of the shape with a magnitude of backingThickness
    const offsetTopVector = Vector2.createPolar( backingThickness, -sign * angle );
    const offsetBottomVector = Vector2.createPolar( backingThickness, sign * angle );

    // four corners of the mirror shape
    const topLeft = new Vector2( sign * halfWidth, halfHeight );
    const topRight = topLeft.plus( offsetTopVector );
    const bottomLeft = new Vector2( sign * halfWidth, -halfHeight );
    const bottomRight = bottomLeft.plus( offsetBottomVector );

    // control points: Note that the curve will not go through the control points.
    // rather, it will go through the two following points: (0,0) and ( backingThickness, 0 )
    const midLeft = new Vector2( -sign * halfWidth, 0 );
    const midRight = midLeft.plusXY( backingThickness, 0 );

    // reflective coating on the front (left-facing) surface of the mirror, with zero area.
    const reflectiveCoatingShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .quadraticCurveToPoint( midLeft, topLeft )
      .close();

    // the mirror's backing, counterclockwise from top-left
    const backingShape = new Shape()
      .moveToPoint( topLeft )
      .quadraticCurveToPoint( midLeft, bottomLeft )
      .lineToPoint( bottomRight )
      .quadraticCurveToPoint( midRight, topRight )
      .close();

    this.reflectiveCoatingShape = reflectiveCoatingShape;
    this.backingShape = backingShape;
    this.frontShape = reflectiveCoatingShape;
    this.backShape = null; // because there is no ray hit testing on the back of a mirror
    this.activeBoundsShape = reflectiveCoatingShape;
  }
}

geometricOptics.register( 'MirrorShapes', MirrorShapes );
