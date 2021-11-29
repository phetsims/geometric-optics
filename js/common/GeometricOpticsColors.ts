// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsColors defines the color profile for this sim.
 * See https://github.com/phetsims/geometric-optics/issues/182 for colors specification.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsColors = {

  // Background color used for all screens
  screenBackgroundColorProperty: new ProfileColorProperty( geometricOptics, 'screenBackgroundColor', {
    default: 'black',
    projector: 'white'
  } ),

  // Fill for the lens
  lensFillProperty: new ProfileColorProperty( geometricOptics, 'lensFill', {
    default: 'rgb( 100, 100, 216 )'
  } ),

  // Stroke for the lens and mirror
  lensStrokeProperty: new ProfileColorProperty( geometricOptics, 'lensStroke', {
    default: 'rgb( 255, 255, 255 )',
    projector: 'black'
  } ),

  // Fill for the mirror
  mirrorFillProperty: new ProfileColorProperty( geometricOptics, 'mirrorFill', {
    default: 'rgb( 100, 100, 216 )'
  } ),

  // Stroke for the mirror
  mirrorStrokeProperty: new ProfileColorProperty( geometricOptics, 'mirrorStroke', {
    default: 'rgb( 255, 255, 255 )',
    projector: 'black'
  } ),

  // Fill for focal points
  focalPointFillProperty: new ProfileColorProperty( geometricOptics, 'focalPointFill', {
    default: 'rgb( 255, 255, 0 )'
  } ),

  // Stroke for focal points
  focalPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'focalPointStroke', {
    default: 'black'
  } ),

  // Stroke for the optical axis
  opticalAxisStrokeProperty: new ProfileColorProperty( geometricOptics, 'opticalAxisStroke', {
    default: 'rgb( 133, 133, 182 )'
  } ),

  // Stroke for the verticl axis
  verticalAxisStrokeProperty: new ProfileColorProperty( geometricOptics, 'verticalAxisStroke', {
    default: 'rgb( 133, 133, 182 )'
  } ),

  // Fill for the second point on the source object
  secondPointFillProperty: new ProfileColorProperty( geometricOptics, 'secondPointFill', {
    default: 'rgb( 255, 51, 51 )'
  } ),

  // Stroke for the second point on the source object
  secondPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'secondPointStroke', {
    default: 'black'
  } ),

  // Rays associated with the real image produced by the first point of interest on the object or light source
  realRays1StrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayOneStroke', {
    default: 'rgb( 200, 200, 200 )',
    projector: 'rgb( 140, 140, 140 )'
  } ),

  // Rays associated with the real image produced by the second point of interest on the object or light source
  realRays2StrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayTwoStroke', {
    default: 'rgb( 41, 214, 126 )'
  } ),

  // Rays associated with the virtual image produced by the first point of interest on the object or light source
  virtualRays1StrokeProperty: new ProfileColorProperty( geometricOptics, 'virtualRayOneStroke', {
    default: 'rgb( 90, 90, 90 )',
    projector: 'rgb( 30, 30, 30 )'
  } ),

  // Rays associated with the virtual image produced by the second point of interest on the object or light source
  virtualRays2StrokeProperty: new ProfileColorProperty( geometricOptics, 'virtualRayTwoStroke', {
    default: 'rgb( 18, 109, 70 )'
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
    default: 'white',
    projector: 'black'
  } ),

  // Fill of the arm (rectangle) portion of guides
  guideArmFillProperty: new ProfileColorProperty( geometricOptics, 'guideArmFill', {
    default: 'white'
  } ),

  // Fill of the fulcrum (circle) portion of guides
  guideFulcrumFillProperty: new ProfileColorProperty( geometricOptics, 'guideFulcrumFill', {
    default: 'grey'
  } ),

  // Stroke for all parts of guides
  guideStrokeProperty: new ProfileColorProperty( geometricOptics, 'guideStroke', {
    default: 'black'
  } ),

  // Fill for the control panel
  panelFillProperty: new ProfileColorProperty( geometricOptics, 'panelFill', {
    default: 'rgb( 240, 240, 240 )'
  } ),

  // Stroke for the control panel
  panelStrokeProperty: new ProfileColorProperty( geometricOptics, 'panelStroke', {
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

geometricOptics.register( 'GeometricOpticsColors', GeometricOpticsColors );
export default GeometricOpticsColors;
