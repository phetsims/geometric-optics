// Copyright 2021, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsConstants = {

  SCREEN_VIEW_X_MARGIN: 20,
  SCREEN_VIEW_Y_MARGIN: 15,

  // Axes --------------------------------------------------------------------------------------------------------------

  // view
  AXIS_LINE_WIDTH: 2,
  AXIS_LINE_DASH: [ 8, 5 ],

  // Rulers ------------------------------------------------------------------------------------------------------------

  // model
  HORIZONTAL_RULER_LENGTH: 260, // cm
  VERTICAL_RULER_LENGTH: 160, // cm
  HORIZONTAL_RULER_INITIAL_POSITION: new Vector2( 200, 100 ), // cm
  VERTICAL_RULER_INITIAL_POSITION: new Vector2( 100, 300 ), // cm

  // view
  RULER_HEIGHT: 40, // in view coordinates
  RULER_MINIMUM_VISIBLE_LENGTH: 40, // portion of the ruler always within visible bounds, in view coordinates

  // Decimal places and intervals for controls -------------------------------------------------------------------------

  RADIUS_OF_CURVATURE_DECIMAL_PLACES: 0,
  RADIUS_OF_CURVATURE_SLIDER_INTERVAL: 5, // cm
  RADIUS_OF_CURVATURE_SPINNER_INTERVAL: 1, // cm

  INDEX_OF_REFRACTION_DECIMAL_PLACES: 2,
  INDEX_OF_REFRACTION_SLIDER_INTERVAL: 0.05,
  INDEX_OF_REFRACTION_SPINNER_INTERVAL: 0.01,

  DIAMETER_DECIMAL_PLACES: 0,
  DIAMETER_SLIDER_INTERVAL: 5, // cm
  DIAMETER_SPINNER_INTERVAL: 1, // cm

  // Fonts -------------------------------------------------------------------------------------------------------------

  LABEL_FONT: new PhetFont( 12 ),
  CONTROL_FONT: new PhetFont( 14 ),
  TITLE_FONT: new PhetFont( { weight: 'bold', size: 14 } )
};

geometricOptics.register( 'GeometricOpticsConstants', GeometricOpticsConstants );
export default GeometricOpticsConstants;
