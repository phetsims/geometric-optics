// Copyright 2021-2022, University of Colorado Boulder

/**
 * LightSpotNode is the circular light that is projected onto the screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import GOColors from '../../common/GOColors.js';
import geometricOptics from '../../geometricOptics.js';
import LightSpot from '../model/LightSpot.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import GOConstants from '../GOConstants.js';

type LightSpotNodeOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>;

class LightSpotNode extends Node {

  /**
   * @param lightSpot
   * @param modelViewTransform
   * @param providedOptions
   */
  constructor( lightSpot: LightSpot, modelViewTransform: ModelViewTransform2, providedOptions: LightSpotNodeOptions ) {

    super( providedOptions );

    // Fill color of the spot
    const fillPath = new Path( null, {
      fill: GOColors.lightSpotFillProperty
    } );
    this.addChild( fillPath );

    // Dashed outline of the spot, so it's easier to see when intensity is low.
    // See https://github.com/phetsims/geometric-optics/issues/240
    const strokePath = new Path( null, {
      stroke: GOColors.lightSpotStrokeProperty,
      lineWidth: 0.75,
      lineDash: [ 4, 4 ]
    } );
    this.addChild( strokePath );

    lightSpot.shapeProperty.link( shape => {
      const viewShape = modelViewTransform.modelToViewShape( shape );
      fillPath.shape = viewShape;
      strokePath.shape = viewShape;
    } );

    lightSpot.intensityProperty.link( intensity => {

      // Opacity is equivalent to opacity.
      assert && assert( GOConstants.OPACITY_RANGE.equals( GOConstants.INTENSITY_RANGE ) );
      const opacity = intensity;

      // Intensity of light is the opacity of the spot color.
      fillPath.opacity = opacity;

      // Dashed outline is visible only for lower intensities [0,0.25], and becomes more visible as intensity decreases.
      // See https://github.com/phetsims/geometric-optics/issues/240
      strokePath.opacity = Utils.clamp( Utils.linear( 0, 0.25, 1, 0, opacity ), 0, 1 );
    } );

    this.addLinkedElement( lightSpot, {
      tandem: providedOptions.tandem.createTandem( 'lightSpot' )
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LightSpotNode', LightSpotNode );
export default LightSpotNode;