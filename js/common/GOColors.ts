// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOColors defines the color profile for this sim.
 * See https://github.com/phetsims/geometric-optics/issues/182 for colors specification.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import geometricOptics from '../geometricOptics.js';

const OBJECT_2_FILL = 'rgb( 255, 51, 51 )';

const GOColors = {

  // Background color used for all screens
  screenBackgroundColorProperty: new ProfileColorProperty( geometricOptics, 'screenBackgroundColor', {
    default: 'rgb( 250, 250, 250 )',
    projector: 'white'
  } ),

  // Fill for the control panel
  panelFillProperty: new ProfileColorProperty( geometricOptics, 'panelFill', {
    default: 'rgb( 230, 246, 249 )',
    projector: 'rgb( 240, 240, 240 )'
  } ),

  // Stroke for the control panel
  panelStrokeProperty: new ProfileColorProperty( geometricOptics, 'panelStroke', {
    default: 'black'
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

  // Fill for the second point on a Framed Object
  secondPointFillProperty: new ProfileColorProperty( geometricOptics, 'secondPointFill', {
    default: OBJECT_2_FILL
  } ),

  // Stroke for the second point on a Framed Object
  secondPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'secondPointStroke', {
    default: 'black'
  } ),

  arrow1FillProperty: new ProfileColorProperty( geometricOptics, 'arrow1Fill', {
    default: 'rgb( 81, 203, 245 )'
  } ),

  arrow1StrokeProperty: new ProfileColorProperty( geometricOptics, 'arrow1Stroke', {
    default: 'black'
  } ),

  arrow2FillProperty: new ProfileColorProperty( geometricOptics, 'arrow2Fill', {
    default: OBJECT_2_FILL
  } ),

  arrow2StrokeProperty: new ProfileColorProperty( geometricOptics, 'arrow2Stroke', {
    default: 'black'
  } ),

  // Rays associated with the first Optical Object
  rays1StrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayOneStroke', {
    default: 'rgb( 140, 140, 140 )'
  } ),

  // Rays associated with the second point on a Framed Object, or the second Light Source
  rays2StrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayTwoStroke', {
    default: 'rgb( 41, 214, 126 )'
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
    default: 'white'
  } ),

  // Fill of the arm (rectangle) portion of the guide associated with the second optical object
  guideArm2FillProperty: new ProfileColorProperty( geometricOptics, 'guideArm2Fill', {
    default: 'rgb( 41, 214, 126 )'
  } ),

  // Fill of the fulcrum (circle) portion of guides
  guideFulcrumFillProperty: new ProfileColorProperty( geometricOptics, 'guideFulcrumFill', {
    default: 'grey'
  } ),

  // Stroke for all parts of guides
  guideStrokeProperty: new ProfileColorProperty( geometricOptics, 'guideStroke', {
    default: 'black'
  } ),

  // Stroke for a selected radio button that determines the shape of the lens/mirror
  curveRadioButtonSelectedStrokeProperty: new ProfileColorProperty( geometricOptics, 'curveRadioButtonSelectedStroke', {
    default: 'rgb( 65, 154, 201 )'
  } ),

  // Stroke for a deselected radio button that determines the shape of the lens/mirror
  curveRadioButtonDeselectedStrokeProperty: new ProfileColorProperty( geometricOptics, 'curveRadioButtonDeselectedStroke', {
    default: 'grey'
  } ),

  // Fill for radio buttons that determines the shape of the lens/mirror
  curveRadioButtonFillProperty: new ProfileColorProperty( geometricOptics, 'curveRadioButtonFill', {
    default: 'rgba( 0, 0, 0, 0 )'
  } )
};

geometricOptics.register( 'GOColors', GOColors );
export default GOColors;
