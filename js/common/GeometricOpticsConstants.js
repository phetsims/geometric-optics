// Copyright 2021, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../dot/js/Vector2.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsConstants = {

  //----------------------------------------------------------------------------------------
  //                         UNIVERSAL CONSTANTS

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  MIN_SCENE_WIDTH: 3.8, // Meters
  MIN_SCENE_HEIGHT: 2.3, // Meters

  DEFAULT_SOURCE_POINT_1: new Vector2( -1.5, 0.0 ),
  DEFAULT_SOURCE_POINT_2: new Vector2( -1.5, -0.2 ),

  ZOOM_RANGE: new RangeWithValue( 1, 5, 4 ),

  //----------------------------------------------------------------------------------------
  //                                 LENS


  INDEX_OF_REFRACTION_RANGE: new RangeWithValue( 1.20, 1.87, 1.53 ),

  RADIUS_OF_CURVATURE_RANGE: new RangeWithValue( 0.3, 1.3, 0.8 ),

  DIAMETER_RANGE: new RangeWithValue( 0.3, 1.3, 0.8 ),

  //----------------------------------------------------------------------------------------
  //                                 FOCAL POINT


  FOCAL_POINT_LINE_WIDTH: 1,
  FOCAL_POINT_SIZE: new Dimension2( 15, 3 ),

  //----------------------------------------------------------------------------------------
  //                           OPTICAL AXIS

  OPTICAL_AXIS_WIDTH: 2,

  //----------------------------------------------------------------------------------------
  //                             OBJECT VIEW


  PICTURE_HEIGHT_IN_METERS: 0.73,
  PICTURE_X_ANCHOR: 0.57,
  PICTURE_Y_ANCHOR: 0.2,
  SECOND_POINT_Y_SPAN_IN_METERS: 0.32, // PICTURE_HEIGHT_IN_METERS * (1 - ObjectView.PICTURE_Y_ANCHOR * 2),

  SECOND_POINT_SIZE: 12,


  //----------------------------------------------------------------------------------------
  //                              RAYS


  LENS_TIP_OFFSET: 0.025, // meters

  LENS_LINE_WIDTH: 2,


  //----------------------------------------------------------------------------------------
  //                              GUIDES


  GUIDE_LINE_WIDTH: 1,
  GUIDE_WIDTH: 0.48, // Meters
  GUIDE_HEIGHT: 0.03, // Meters

  //----------------------------------------------------------------------------------------
  //                             PROJECTION SCREEN


  SCREEN_HEIGHT_IN_METERS: 1.5,

  MASK_TL_CORNER: new Vector2( 11, 168 ),
  MASK_BL_CORNER: new Vector2( 11, 523 ),
  MASK_BR_CORNER: new Vector2( 220, 642 ),
  MASK_TR_CORNER: new Vector2( 220, 35 ),

  FULL_BRIGHT_SPOT_HEIGHT: 0.07 // Meters

};

geometricOptics.register( 'GeometricOpticsConstants', GeometricOpticsConstants );
export default GeometricOpticsConstants;
