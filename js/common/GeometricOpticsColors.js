// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsColors defines the color profile for this sim.
 *
 * @author Martin Veillette
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsColors = {

  //--------------------------------------------------------------------------
  //                                SCREEN

  screenBackgroundColorProperty: new ProfileColorProperty( geometricOptics, 'screenBackgroundColor', {
    default: 'rgb(27,27,96)' // dark blue
  } ),

  //--------------------------------------------------------------------------
  //                                 Optic

  opticFillProperty: new ProfileColorProperty( geometricOptics, 'opticFill', {
    default: 'rgb(100, 100, 245)'
  } ),

  opticStrokeProperty: new ProfileColorProperty( geometricOptics, 'opticStroke', {
    default: 'rgb(255, 255, 255)'
  } ),

  //--------------------------------------------------------------------------
  //                                 FOCAL POINT

  focalPointFillProperty: new ProfileColorProperty( geometricOptics, 'focalPointFill', {
    default: 'rgb(255, 255, 0)'
  } ),

  focalPointStrokeProperty: new ProfileColorProperty( geometricOptics, 'focalPointStroke', {
    default: 'rgb(255, 255, 0)'
  } ),

  //--------------------------------------------------------------------------
  //                           OPTICAL AXIS

  opticalAxisStrokeProperty: new ProfileColorProperty( geometricOptics, 'opticalAxisStroke', {
    default: 'rgb(133,133,182)'
  } ),

  //--------------------------------------------------------------------------
  //                             OBJECT

  secondSourcePointFillProperty: new ProfileColorProperty( geometricOptics, 'secondSourcePointFill', {
    default: 'red'
  } ),
  secondSourcePointStrokeProperty: new ProfileColorProperty( geometricOptics, 'secondSourcePointStroke', {
    default: 'black'
  } ),

  //--------------------------------------------------------------------------
  //                              RAYS

  virtualRayOneStrokeProperty: new ProfileColorProperty( geometricOptics, 'virtualRayOneStroke', {
    default: 'rgb(59,177,122)'
  } ),

  virtualRayTwoStrokeProperty: new ProfileColorProperty( geometricOptics, 'virtualRayTwoStroke', {
    default: 'rgb(238,106,205)'
  } ),

  realRayOneStrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayOneStroke', {
    default: 'rgb(160,226,195)'
  } ),

  realRayTwoStrokeProperty: new ProfileColorProperty( geometricOptics, 'realRayTwoStroke', {
    default: 'rgb(255,207,232)'
  } ),

  //--------------------------------------------------------------------------
  //                     PROJECTOR SCREEN (BLACKBOARD)

  projectorScreenSpotlightFillProperty: new ProfileColorProperty( geometricOptics, 'projectorScreenSpotlightFill', {
    default: 'yellow'
  } ),

  //--------------------------------------------------------------------------
  //                              LABELS

  labelBackgroundFillProperty: new ProfileColorProperty( geometricOptics, 'labelBackgroundFill', {
    default: 'rgb(27,27,96)'
  } ),

  //--------------------------------------------------------------------------
  //                              GUIDES

  guidesFillProperty: new ProfileColorProperty( geometricOptics, 'guidesFill', {
    default: 'rgb(255, 255, 0)'
  } ),
  guidesStrokeProperty: new ProfileColorProperty( geometricOptics, 'guidesStroke', {
    default: 'rgb(255, 0, 0)'
  } ),

  //--------------------------------------------------------------------------
  //                           CONTROL PANEL

  panelStrokeProperty: new ProfileColorProperty( geometricOptics, 'panelStroke', {
    default: 'rgb(217,205,205)'
  } ),
  panelFillProperty: new ProfileColorProperty( geometricOptics, 'panelFill', {
    default: 'rgb(240,234,227)'
  } )
};

geometricOptics.register( 'GeometricOpticsColors', GeometricOpticsColors );
export default GeometricOpticsColors;
