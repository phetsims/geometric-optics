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

  //----------------------------------------------------------------------------------------
  //                         UNIVERSAL CONSTANTS

  SCREEN_VIEW_X_MARGIN: 20, // margin along horizontal axis of screen (in view coordinates)
  SCREEN_VIEW_Y_MARGIN: 15, // margin along vertical axis of screen

  ZOOM_RANGE: new RangeWithValue( 1, 3, 3 ),
  ZOOM_SCALE_FACTOR: 2, // should not be changed to keep major tick labels as multiples of 10

  //TODO this is awful, relies on ScreenView.DEFAULT_LAYOUT_BOUNDS
  ORIGIN_POINT: new Vector2( 1024 / 2, 618 / 2 - 50 ), // view position of the model origin (0,0)
  NOMINAL_VIEW_MODEL_CONVERSION: 2, // view coordinates per cm in initial zoom level

  RAYS_ANIMATION_TIME: 10, // length of the rays animation, in seconds

  //----------------------------------------------------------------------------------------
  //                           AXES

  AXIS_LINE_WIDTH: 2,
  AXIS_LINE_DASH: [ 8, 5 ],

  //--------------------------------------------------------------------------------------
  //                               RULER

  RULER_HEIGHT: 40, // in view coordinates
  RULER_MINIMUM_VISIBLE_LENGTH: 40, // portion of the ruler always within visible bounds, in view coordinates
  HORIZONTAL_RULER_LENGTH: 260, // cm
  VERTICAL_RULER_LENGTH: 160, // cm
  HORIZONTAL_RULER_INITIAL_POSITION: new Vector2( 200, 100 ), // cm
  VERTICAL_RULER_INITIAL_POSITION: new Vector2( 100, 300 ), // cm

  //----------------------------------------------------------------------------------------
  //                              GUIDES

  GUIDE_LINE_WIDTH: 1,
  GUIDE_RECTANGLE_WIDTH: 48, // length of the guide, in cm
  GUIDE_RECTANGLE_HEIGHT: 3, // in view coordinates
  GUIDE_FULCRUM_RADIUS: 5, // in view coordinates

  //----------------------------------------------------------------------------------------
  //                             PROJECTION SCREEN

  // in cm, relative to projectorScreen.png. +x is left, +y is up.
  // Run with ?showProjectorScreenMask to display the bounds of this mask.
  PROJECTOR_SCREEN_MASK_CORNERS: {
    LEFT_TOP: new Vector2( -20, 56 ),
    LEFT_BOTTOM: new Vector2( -20, -59 ),
    RIGHT_BOTTOM: new Vector2( 22, -72 ),
    RIGHT_TOP: new Vector2( 22, 67 )
  },

  PROJECTOR_INITIAL_POSITION: new Vector2( 200, 0 ),
  PROJECTOR_SCALE: 0.5, // scaling factor applied to the projector screen image
  FULL_BRIGHT_SPOT_HEIGHT: 7, // cm

  //----------------------------------------------------------------------------------------
  //                        DECIMAL PLACES

  CURVATURE_RADIUS_DECIMAL_PLACES: 0,
  REFRACTIVE_INDEX_DECIMAL_PLACES: 2,
  DIAMETER_DECIMAL_PLACES: 0,

  //----------------------------------------------------------------------------------------
  //                                 FONTS

  LABEL_FONT: new PhetFont( 12 ),
  CONTROL_FONT: new PhetFont( 14 ),
  TITLE_FONT: new PhetFont( { weight: 'bold', size: 14 } )
};

geometricOptics.register( 'GeometricOpticsConstants', GeometricOpticsConstants );
export default GeometricOpticsConstants;
