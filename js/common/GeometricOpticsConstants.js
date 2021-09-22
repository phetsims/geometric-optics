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
import Optic from './model/Optic.js';

const GeometricOpticsConstants = {

  //----------------------------------------------------------------------------------------
  //                         UNIVERSAL CONSTANTS

  SCREEN_VIEW_X_MARGIN: 20, // margin along horizontal axis of screen (in view coordinates)
  SCREEN_VIEW_Y_MARGIN: 15, // margin along vertical axis of screen

  DEFAULT_SOURCE_POINT_1: new Vector2( -190, 30 ), // centimeters
  DEFAULT_SOURCE_POINT_2: new Vector2( -150, -20 ), // centimeters
  SECOND_OBJECT_VERTICAL_RANGE: new RangeWithValue( -55, 0, -52 ), // in centimeters
  OBJECT_SCALE_FACTOR: 4,
  SOURCE_SCALE_FACTOR: 2,

  ZOOM_RANGE: new RangeWithValue( 1, 3, 3 ),
  ZOOM_SCALE_FACTOR: 2, // should not be changed to keep major tick labels as multiples of 10

  ORIGIN_POINT: new Vector2( 1024 / 2, 618 / 2 - 50 ), // view position of the model origin (0,0)
  NOMINAL_VIEW_MODEL_CONVERSION: 2, // view coordinates per cm in initial zoom level

  RAYS_ANIMATION_TIME: 10, // length of the rays animation, in seconds

  //----------------------------------------------------------------------------------------
  //                                 LENS

  LENS_INITIAL_POSITION: Vector2.ZERO,
  LENS_INITIAL_CURVATURE_TYPE: Optic.Curve.CONVEX,
  LENS_INDEX_OF_REFRACTION_RANGE: new RangeWithValue( 1.20, 1.87, 1.53 ),
  LENS_RADIUS_OF_CURVATURE_RANGE: new RangeWithValue( 30, 130, 80 ), // centimeters
  LENS_DIAMETER_RANGE: new RangeWithValue( 30, 130, 80 ), // centimeters

  //----------------------------------------------------------------------------------------
  //                                 MIRROR

  MIRROR_INITIAL_POSITION: new Vector2( 100, 0 ), // centimeters
  MIRROR_INITIAL_CURVATURE_TYPE: Optic.Curve.CONCAVE,
  MIRROR_RADIUS_OF_CURVATURE_RANGE: new RangeWithValue( 150, 250, 200 ), // centimeters
  MIRROR_DIAMETER_RANGE: new RangeWithValue( 30, 150, 80 ), // centimeters

  //----------------------------------------------------------------------------------------
  //                           OPTICAL AXIS

  OPTICAL_AXIS_LINE_WIDTH: 2,

  //----------------------------------------------------------------------------------------
  //                              RAYS

  OPTICAL_ELEMENT_LINE_WIDTH: 2,

  //--------------------------------------------------------------------------------------
  //                               RULER

  RULER_HEIGHT: 40, // in view coordinates
  MINIMUM_VISIBLE_LENGTH: 40, // portion of the ruler always within visible bounds, in view coordinates
  HORIZONTAL_RULER_LENGTH: 260, // centimeters
  VERTICAL_RULER_LENGTH: 160, // centimeters
  HORIZONTAL_RULER_INITIAL_POSITION: new Vector2( 200, 100 ),
  VERTICAL_RULER_INITIAL_POSITION: new Vector2( 100, 300 ),

  //----------------------------------------------------------------------------------------
  //                              GUIDES

  GUIDE_LINE_WIDTH: 1,
  GUIDE_RECTANGLE_WIDTH: 48, // centimeters  - length of the guide
  GUIDE_RECTANGLE_HEIGHT: 3, // in view coordinates
  GUIDE_FULCRUM_RADIUS: 5, // in view coordinates

  //----------------------------------------------------------------------------------------
  //                             PROJECTION SCREEN

  PROJECTOR_SCREEN_MASK_CORNERS: {
    LEFT_TOP: new Vector2( -28, 39 ), // centimeters
    LEFT_BOTTOM: new Vector2( -28, -51 ),
    RIGHT_BOTTOM: new Vector2( 25, -83 ),
    RIGHT_TOP: new Vector2( 25, 72 )
  },

  PROJECTOR_INITIAL_POSITION: new Vector2( 200, 0 ),
  PROJECTOR_SCALE: 0.5, // scaling factor applied to the projector screen image
  FULL_BRIGHT_SPOT_HEIGHT: 7, // centimeters

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
