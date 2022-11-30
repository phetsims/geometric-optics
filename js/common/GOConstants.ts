// Copyright 2021-2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import geometricOptics from '../geometricOptics.js';
import NumberControl, { NumberControlOptions } from '../../../scenery-phet/js/NumberControl.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import { KeyboardDragListenerOptions } from '../../../scenery/js/imports.js';
import { ArrowNodeOptions } from '../../../scenery-phet/js/ArrowNode.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';

const CONTROL_FONT = new PhetFont( 14 );

// Shared with geometric-optics-basics
const CREDITS: CreditsData = {
  leadDesign: 'Amy Rouinfar, Michael Dubson',
  softwareDevelopment: 'Sarah Chang, Chris Malley (PixelZoom, Inc.), Martin Veillette',
  team: 'Chris Klusendorf, Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins',
  qualityAssurance: 'Steele Dalton, Jaron Droder, Clifford Hardin, Emily Miller, Nancy Salpepi, Kathryn Woessner',
  graphicArts: 'Megan Lai'
};

const ARROW_NODE_OPTIONS: ArrowNodeOptions = {
  headWidth: 18,
  headHeight: 21,
  tailWidth: 2,
  isHeadDynamic: true,
  fractionalHeadHeight: 0.5
};

const KEYBOARD_DRAG_LISTENER_OPTIONS: KeyboardDragListenerOptions = {
  dragVelocity: 300, // velocity of the Node being dragged, in view coordinates per second
  shiftDragVelocity: 20 // velocity with the Shift key pressed, typically slower than dragVelocity
};

const NUMBER_CONTROL_OPTIONS: NumberControlOptions = {
  layoutFunction: NumberControl.createLayoutFunction3( { ySpacing: 12 } ),
  titleNodeOptions: {
    font: CONTROL_FONT,
    maxWidth: 140
  },
  sliderOptions: {
    trackSize: new Dimension2( 140, 4 ),
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
};

const GOConstants = {

  SCREEN_VIEW_X_MARGIN: 20,
  SCREEN_VIEW_Y_MARGIN: 15,

  CREDITS: CREDITS,

  // Objects -----------------------------------------------------------------------------------------------------------

  // BEWARE! Getting too close to the optic will reveal problems with the model.
  MIN_DISTANCE_FROM_OBJECT_TO_OPTIC: 40, // cm
  MIN_DISTANCE_FROM_OPTIC_TO_PROJECTION_SCREEN: 60, // cm

  // Maximum distance that objects can be dragged vertically from the optical axis, in cm. This is constrained to
  // prevent cases where the optical object is close to the optic and no 'Many' rays go through the optic.
  // See https://github.com/phetsims/geometric-optics/issues/289
  MAX_DISTANCE_FROM_OBJECT_TO_OPTICAL_AXIS: 100, // cm

  // Rulers ------------------------------------------------------------------------------------------------------------

  // model
  HORIZONTAL_RULER_LENGTH: 260, // cm
  VERTICAL_RULER_LENGTH: 160, // cm

  // view
  RULER_HEIGHT: 40, // in view coordinates
  RULER_MINIMUM_VISIBLE_LENGTH: 40, // portion of the ruler always within visible bounds, in view coordinates

  // Decimal places and steps for controls -------------------------------------------------------------------------

  FOCAL_LENGTH_DECIMAL_PLACES: 0,
  FOCAL_LENGTH_SPINNER_STEP: 1, // cm
  FOCAL_LENGTH_SLIDER_STEP: 5, // cm
  FOCAL_LENGTH_KEYBOARD_STEP: 5, // cm
  FOCAL_LENGTH_SHIFT_KEYBOARD_STEP: 1, // cm
  FOCAL_LENGTH_PAGE_KEYBOARD_STEP: 10, // cm

  RADIUS_OF_CURVATURE_DECIMAL_PLACES: 0,
  RADIUS_OF_CURVATURE_SPINNER_STEP: 1, // cm
  RADIUS_OF_CURVATURE_SLIDER_STEP: 5, // cm
  RADIUS_OF_CURVATURE_KEYBOARD_STEP: 5, // cm
  RADIUS_OF_CURVATURE_SHIFT_KEYBOARD_STEP: 1, // cm
  RADIUS_OF_CURVATURE_PAGE_KEYBOARD_STEP: 10, // cm

  INDEX_OF_REFRACTION_DECIMAL_PLACES: 2,
  INDEX_OF_REFRACTION_SPINNER_STEP: 0.01,
  INDEX_OF_REFRACTION_SLIDER_STEP: 0.05,
  INDEX_OF_REFRACTION_KEYBOARD_STEP: 0.05,
  INDEX_OF_REFRACTION_SHIFT_KEYBOARD_STEP: 0.01,
  INDEX_OF_REFRACTION_PAGE_KEYBOARD_STEP: 0.1,

  DIAMETER_DECIMAL_PLACES: 0,
  DIAMETER_SPINNER_STEP: 1, // cm
  DIAMETER_SLIDER_STEP: 5, // cm
  DIAMETER_KEYBOARD_STEP: 5, // cm
  DIAMETER_SHIFT_KEYBOARD_STEP: 1, // cm
  DIAMETER_PAGE_KEYBOARD_STEP: 10, // cm

  // Fonts -------------------------------------------------------------------------------------------------------------

  LABEL_FONT: new PhetFont( 12 ),
  CONTROL_FONT: CONTROL_FONT,
  TITLE_FONT: new PhetFont( { weight: 'bold', size: 14 } ),

  // Misc --------------------------------------------------------------------------------------------------------------

  INTENSITY_RANGE: new Range( 0, 1 ),
  OPACITY_RANGE: new Range( 0, 1 ),
  MIN_SCALE: 1e-5, // to prevent zero scaling, see https://github.com/phetsims/geometric-optics/issues/155
  MIN_MAGNITUDE: 1e-5, // to prevent zero-magnitude ArrowNode, see https://github.com/phetsims/geometric-optics/issues/306

  // Options -----------------------------------------------------------------------------------------------------------

  CHECKBOX_BOX_WIDTH: 14,
  ARROW_NODE_OPTIONS: ARROW_NODE_OPTIONS,
  KEYBOARD_DRAG_LISTENER_OPTIONS: KEYBOARD_DRAG_LISTENER_OPTIONS,
  NUMBER_CONTROL_OPTIONS: NUMBER_CONTROL_OPTIONS
};

geometricOptics.register( 'GOConstants', GOConstants );
export default GOConstants;
