// Copyright 2021, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsConstants = {

  SCREEN_VIEW_X_MARGIN: 20, // margin along horizontal axis of screen (in view coordinates)
  SCREEN_VIEW_Y_MARGIN: 15, // margin along vertical axis of screen
  ZOOM_RANGE: new RangeWithValue( 1, 3, 3 ),
  NOMINAL_VIEW_MODEL_CONVERSION: 2, // view coordinates per cm in initial zoom level
  RAYS_ANIMATION_TIME: 10, // length of the rays animation, in seconds

  // Axes --------------------------------------------------------------------------------------------------------------

  AXIS_LINE_WIDTH: 2,
  AXIS_LINE_DASH: [ 8, 5 ],

  // Rulers ------------------------------------------------------------------------------------------------------------

  RULER_HEIGHT: 40, // in view coordinates
  RULER_MINIMUM_VISIBLE_LENGTH: 40, // portion of the ruler always within visible bounds, in view coordinates
  HORIZONTAL_RULER_LENGTH: 260, // cm
  VERTICAL_RULER_LENGTH: 160, // cm
  HORIZONTAL_RULER_INITIAL_POSITION: new Vector2( 200, 100 ), // cm
  VERTICAL_RULER_INITIAL_POSITION: new Vector2( 100, 300 ), // cm

  // Guides ------------------------------------------------------------------------------------------------------------

  //TODO there's an odd mix of model and view values here
  GUIDE_LINE_WIDTH: 1,
  GUIDE_RECTANGLE_WIDTH: 48, // length of the guide, in cm
  GUIDE_RECTANGLE_HEIGHT: 3, // in view coordinates
  GUIDE_FULCRUM_RADIUS: 5, // in view coordinates

  // Projector Screen --------------------------------------------------------------------------------------------------

  // in cm, relative to projectorScreen.png. +x is left, +y is up.
  // Run with ?showProjectorScreenMask to display the bounds of this mask.
  PROJECTOR_SCREEN_MASK_CORNERS: {
    LEFT_TOP: new Vector2( -20, 56 ),
    LEFT_BOTTOM: new Vector2( -20, -59 ),
    RIGHT_BOTTOM: new Vector2( 22, -73 ),
    RIGHT_TOP: new Vector2( 22, 67 )
  },
  PROJECTOR_SCREEN_INITIAL_POSITION: new Vector2( 200, 0 ), // cm
  PROJECTOR_SCREEN_SCALE: 0.5, // scaling factor applied to the projector screen image
  FULL_INTENSITY_LIGHT_SPOT_HEIGHT: 7, // cm, any light spot less than this height will be full intensity

  // Decimal places ----------------------------------------------------------------------------------------------------

  CURVATURE_RADIUS_DECIMAL_PLACES: 0,
  REFRACTIVE_INDEX_DECIMAL_PLACES: 2,
  DIAMETER_DECIMAL_PLACES: 0,

  // Fonts -------------------------------------------------------------------------------------------------------------

  LABEL_FONT: new PhetFont( 12 ),
  CONTROL_FONT: new PhetFont( 14 ),
  TITLE_FONT: new PhetFont( { weight: 'bold', size: 14 } )
};

geometricOptics.register( 'GeometricOpticsConstants', GeometricOpticsConstants );
export default GeometricOpticsConstants;
