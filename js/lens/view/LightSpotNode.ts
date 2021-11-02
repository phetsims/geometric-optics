// Copyright 2021, University of Colorado Boulder

/**
 * LightSpotNode is the circular light that is projected onto the screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import GeometricOpticsColors from '../../common/GeometricOpticsColors.js';
import geometricOptics from '../../geometricOptics.js';

class LightSpotNode extends Node {

  /**
   * @param {Property.<number>} intensityProperty
   * @param {Property.<Shape>} screenIntersectionProperty - shape of the spot's intersection with the projection screen
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( intensityProperty: Property<number>, screenIntersectionProperty: Property<Shape>,
               modelViewTransform: ModelViewTransform2, options: any ) { //TODO any

    options = merge( {}, options );

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

    assert && assert( !options.children );
    options.children = [ fillPath, strokePath ];

    super( options );

    // Adjust the shape of the spot based on how it intersects the screen.
    screenIntersectionProperty.link( ( shape: Shape ) => {
      const viewShape = modelViewTransform.modelToViewShape( shape );
      fillPath.shape = viewShape;
      strokePath.shape = viewShape;
    } );

    intensityProperty.link( ( intensity: number ) => {

      // Intensity of light is the opacity of the spot color.
      fillPath.opacity = intensity;

      // Dashed outline is visible only for lower intensities [0,0.25], and becomes more visible as intensity decreases.
      // See https://github.com/phetsims/geometric-optics/issues/240
      strokePath.opacity = Utils.clamp( Utils.linear( 0, 0.25, 1, 0, intensity ), 0, 1 );
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

geometricOptics.register( 'LightSpotNode', LightSpotNode );
export default LightSpotNode;