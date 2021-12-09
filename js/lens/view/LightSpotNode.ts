// Copyright 2021, University of Colorado Boulder

/**
 * LightSpotNode is the circular light that is projected onto the screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import geometricOptics from '../../geometricOptics.js';
import LightSpot from '../model/LightSpot.js';

type Options = {
  visibleProperty: IProperty<boolean>
};

class LightSpotNode extends Node {

  /**
   * @param lightSpot
   * @param modelViewTransform
   * @param options
   */
  constructor( lightSpot: LightSpot, modelViewTransform: ModelViewTransform2, options: Options ) {

    // Fill color of the spot
    const fillPath = new Path( null, {
      fill: GeometricOpticsColors.lightSpotFillProperty
    } );

    // Dashed outline of the spot, so it's easier to see when intensity is low.
    // See https://github.com/phetsims/geometric-optics/issues/240
    const strokePath = new Path( null, {
      stroke: GeometricOpticsColors.lightSpotStrokeProperty,
      lineWidth: 0.75,
      lineDash: [ 4, 4 ]
    } );

    super( merge( {
      children: [ fillPath, strokePath ]
    }, options ) );

    lightSpot.shapeProperty.link( shape => {
      const viewShape = modelViewTransform.modelToViewShape( shape );
      fillPath.shape = viewShape;
      strokePath.shape = viewShape;
    } );

    lightSpot.intensityProperty.link( intensity => {

      // Convert intensity to opacity.
      const opacity = ( intensity === null ) ? 0 : intensity!;

      // Intensity of light is the opacity of the spot color.
      fillPath.opacity = opacity;

      // Dashed outline is visible only for lower intensities [0,0.25], and becomes more visible as intensity decreases.
      // See https://github.com/phetsims/geometric-optics/issues/240
      strokePath.opacity = Utils.clamp( Utils.linear( 0, 0.25, 1, 0, opacity ), 0, 1 );
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LightSpotNode', LightSpotNode );
export default LightSpotNode;