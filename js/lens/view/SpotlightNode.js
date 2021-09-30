// Copyright 2021, University of Colorado Boulder

/**
 * SpotlightNode is the circular light that is projected onto the screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import geometricOptics from '../../geometricOptics.js';

class SpotlightNode extends Path {

  /**
   * @param {Property.<number>} intensityProperty
   * @param {Property.<Shape>} screenIntersectionProperty - shape of the spotlight's intersection with the projection screen
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( intensityProperty, screenIntersectionProperty, modelViewTransform, options ) {

    options = merge( {
      fill: GeometricOpticsColors.lightSpotFillProperty
    }, options );

    super( new Shape( screenIntersectionProperty.value ), options );

    // Intensity of light is the opacity
    intensityProperty.link( intensity => {
      this.opacity = intensity;
    } );

    // Adjust the shape of the spotlight based on how it intersects the screen.
    screenIntersectionProperty.link( shape => {
      this.shape = modelViewTransform.modelToViewShape( shape );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'SpotlightNode', SpotlightNode );
export default SpotlightNode;