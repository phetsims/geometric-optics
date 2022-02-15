// Copyright 2021-2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import geometricOptics from '../geometricOptics.js';
import NumberControl from '../../../scenery-phet/js/NumberControl.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';

const CONTROL_FONT = new PhetFont( 14 );

const GOConstants = {

  SCREEN_VIEW_X_MARGIN: 20,
  SCREEN_VIEW_Y_MARGIN: 15,

  // Optic -------------------------------------------------------------------------------------------------------------

  DIAMETER_RANGE: new RangeWithValue( 60, 120, 80 ),

  // Objects -----------------------------------------------------------------------------------------------------------

  // BEWARE! Getting too close to the optic will reveal problems with the model.
  MIN_DISTANCE_FROM_OBJECT_TO_OPTIC: 40, // cm
  MIN_DISTANCE_FROM_OPTIC_TO_PROJECTION_SCREEN: 60, // cm

  // Rulers ------------------------------------------------------------------------------------------------------------

  // model
  HORIZONTAL_RULER_LENGTH: 260, // cm
  VERTICAL_RULER_LENGTH: 160, // cm

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
  CONTROL_FONT: CONTROL_FONT,
  TITLE_FONT: new PhetFont( { weight: 'bold', size: 14 } ),

  // Misc --------------------------------------------------------------------------------------------------------------

  INTENSITY_RANGE: new Range( 0, 1 ),
  MIN_SCALE: 1e-5, // to prevent zero scaling, see https://github.com/phetsims/geometric-optics/issues/155
  MIN_MAGNITUDE: 1e-5, // to prevent zero-magnitude ArrowNode, see https://github.com/phetsims/geometric-optics/issues/306

  // Options -----------------------------------------------------------------------------------------------------------

  NUMBER_CONTROL_OPTIONS: {
    layoutFunction: NumberControl.createLayoutFunction3( { ySpacing: 12 } ),
    titleNodeOptions: {
      font: CONTROL_FONT,
      maxWidth: 140
    },
    sliderOptions: {
      trackSize: new Dimension2( 120, 4 ),
      thumbSize: new Dimension2( 15, 30 ),
      thumbTouchAreaXDilation: 5,
      thumbTouchAreaYDilation: 5
    },
    numberDisplayOptions: {
      maxWidth: 70,
      textOptions: {
        font: CONTROL_FONT
      }
    }
  },

  KEYBOARD_DRAG_LISTENER_OPTIONS: {
    dragVelocity: 300, // velocity of the Node being dragged, in view coordinates per second
    shiftDragVelocity: 20 // velocity with the Shift key pressed, typically slower than dragVelocity
  },

  CUEING_ARROW_SHAPE_OPTIONS: {
    headWidth: 12,
    headHeight: 8,
    tailWidth: 3
  },

  ARROW_NODE_OPTIONS: {
    headWidth: 18,
    headHeight: 21,
    tailWidth: 2,
    isHeadDynamic: true,
    fractionalHeadHeight: 0.5
  }
};

geometricOptics.register( 'GOConstants', GOConstants );
export default GOConstants;
