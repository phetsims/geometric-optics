// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOColors defines the color profile for this sim.
 * See https://github.com/phetsims/geometric-optics/issues/182 for colors specification.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import RulerNode from '../../../scenery-phet/js/RulerNode.js';
import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import geometricOptics from '../geometricOptics.js';

const SECOND_OBJECT_COLOR = PhetColorScheme.RED_COLORBLIND; // BEWARE: If you change this, you should update light2.png.
const POSITION_MARKER_FILL = RulerNode.DEFAULT_FILL;
const POSITION_MARKER_STROKE = 'black';

const GOColors = {

  // Background color used for all screens
  screenBackgroundColorProperty: new ProfileColorProperty( geometricOptics, 'screenBackgroundColor', {
    default: 'rgb( 250, 250, 250 )'
  } ),

  // Fill for the control panel
  panelFillProperty: new ProfileColorProperty( geometricOptics, 'panelFill', {
    default: 'rgb( 230, 246, 249 )'
  } ),

  // Stroke for the control panel
  panelStrokeProperty: new ProfileColorProperty( geometricOptics, 'panelStroke', {
    default: 'black'
  } ),

  // Stroke for vertical separators in the control panel
  panelSeparatorStrokeProperty: new ProfileColorProperty( geometricOptics, 'panelSeparatorStroke', {
    default: 'gray'
  } ),

  // Fill for the lens
  lensFillProperty: new ProfileColorProperty( geometricOptics, 'lensFill', {
    default: 'rgb( 100, 100, 216 )'
  } ),

  // Stroke for the lens
  lensStrokeProperty: new ProfileColorProperty( geometricOptics, 'lensStroke', {
    default: 'black'
  } ),

  // Color of the mirror's backing
  mirrorBackingColorProperty: new ProfileColorProperty( geometricOptics, 'mirrorReflectiveCoatingColor', {
    default: 'rgb( 100, 100, 216 )'
  } ),

  // Color of the mirror's reflective coating
  mirrorReflectiveCoatingColorProperty: new ProfileColorProperty( geometricOptics, 'mirrorBackingColor', {
    default: 'black'
  } ),

  // Fill for focal points (F)
  focalPointFillProperty: new ProfileColorProperty( geometricOptics, 'focalPointFill', {
    default: 'rgb( 255, 255, 0 )'
  } ),

  // Stroke for focal points (F)
  focalPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'focalPointStroke', {
    default: 'black'
  } ),

  // Fill for 2F points
  twoFPointFillProperty: new ProfileColorProperty( geometricOptics, 'twoFPointFill', {
    default: 'rgb( 255, 255, 0 )'
  } ),

  // Stroke for 2F points
  twoFPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'twoFPointStroke', {
    default: 'black'
  } ),

  // Stroke for the optical axis
  opticalAxisStrokeProperty: new ProfileColorProperty( geometricOptics, 'opticalAxisStroke', {
    default: 'rgb( 133, 133, 182 )'
  } ),

  // Stroke for the vertical axis
  verticalAxisStrokeProperty: new ProfileColorProperty( geometricOptics, 'verticalAxisStroke', {
    default: 'rgb( 133, 133, 182 )'
  } ),

  // Fill for the second point on a Framed Object, same as second arrow
  secondPointFillProperty: new ProfileColorProperty( geometricOptics, 'secondPointFill', {
    default: SECOND_OBJECT_COLOR
  } ),

  // Stroke for the second point on a Framed Object
  secondPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'secondPointStroke', {
    default: 'black'
  } ),

  arrow1FillProperty: new ProfileColorProperty( geometricOptics, 'arrow1Fill', {
    default: 'blue'
  } ),

  arrow2FillProperty: new ProfileColorProperty( geometricOptics, 'arrow2Fill', {
    default: SECOND_OBJECT_COLOR
  } ),

  // Rays associated with the first optical object
  rays1StrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayOneStroke', {
    default: 'black'
  } ),

  // Rays associated with the second optical object
  rays2StrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayTwoStroke', {
    default: SECOND_OBJECT_COLOR
  } ),

  // Fill for the screen part of the projection screen
  projectionScreenFillProperty: new ProfileColorProperty( geometricOptics, 'projectionScreenFill', {
    default: 'white'
  } ),

  // Stroke for the screen part of the projection screen
  projectionScreenStrokeProperty: new ProfileColorProperty( geometricOptics, 'projectionScreenStroke', {
    default: 'rgb( 86, 86, 86 )'
  } ),

  // Fill for the light spot that appears on the projection screen
  lightSpotFillProperty: new ProfileColorProperty( geometricOptics, 'lightSpotFill', {
    default: 'rgb( 255, 220, 0 )'
  } ),

  // Stroke (dashed outline) for the light spot that appears on the projection screen
  lightSpotStrokeProperty: new ProfileColorProperty( geometricOptics, 'lightSpotStroke', {
    default: 'rgb( 200, 200, 200 )'
  } ),

  // Color of the text on the labels
  labelFillProperty: new ProfileColorProperty( geometricOptics, 'labelFillProperty', {
    default: 'black'
  } ),

  // Fill of the arm (rectangle) portion of the guide associated with the first optical object
  guideArm1FillProperty: new ProfileColorProperty( geometricOptics, 'guideArm1Fill', {
    default: Color.grayColor( 230 )
  } ),

  // Fill of the arm (rectangle) portion of the guide associated with the second optical object
  guideArm2FillProperty: new ProfileColorProperty( geometricOptics, 'guideArm2Fill', {
    default: SECOND_OBJECT_COLOR
  } ),

  // Fill of the fulcrum (circle) portion of guides
  guideFulcrumFillProperty: new ProfileColorProperty( geometricOptics, 'guideFulcrumFill', {
    default: 'grey'
  } ),

  // Stroke for all parts of guides
  guideStrokeProperty: new ProfileColorProperty( geometricOptics, 'guideStroke', {
    default: 'black'
  } ),

  // Stroke for a selected radio button that determines the surface type of the optic
  curveRadioButtonSelectedStrokeProperty: new ProfileColorProperty( geometricOptics, 'curveRadioButtonSelectedStroke', {
    default: 'rgb( 65, 154, 201 )'
  } ),

  // Stroke for a deselected radio button that determines the surface type of the optic
  curveRadioButtonDeselectedStrokeProperty: new ProfileColorProperty( geometricOptics, 'curveRadioButtonDeselectedStroke', {
    default: 'grey'
  } ),

  // Fill for radio buttons that determines the surface type of the optic
  curveRadioButtonFillProperty: new ProfileColorProperty( geometricOptics, 'curveRadioButtonFill', {
    default: 'rgba( 0, 0, 0, 0 )'
  } ),

  lightPropagationToggleButtonFillProperty: new ProfileColorProperty( geometricOptics, 'lightPropagationToggleButtonFill', {
    default: 'rgb( 240, 234, 227 )'
  } ),

  positionMarker1FillProperty: new ProfileColorProperty( geometricOptics, 'positionMarker1Fill', {
    default: 'rgb( 236, 225, 113 )'
  } ),

  positionMarker1StrokeProperty: new ProfileColorProperty( geometricOptics, 'positionMarker1Stroke', {
    default: POSITION_MARKER_STROKE
  } ),

  positionMarker2FillProperty: new ProfileColorProperty( geometricOptics, 'positionMarker2Fill', {
    default: POSITION_MARKER_FILL
  } ),

  positionMarker2StrokeProperty: new ProfileColorProperty( geometricOptics, 'positionMarker2Stroke', {
    default: POSITION_MARKER_STROKE
  } )
};

geometricOptics.register( 'GOColors', GOColors );
export default GOColors;
