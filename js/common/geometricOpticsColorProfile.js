// Copyright 2021, University of Colorado Boulder

/**
 * geometricOpticsColorProfile defines the color profile for this sim.
 *
 * @author Martin Veillette
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import geometricOptics from '../geometricOptics.js';

const geometricOpticsColorProfile = {


  //--------------------------------------------------------------------------
  //                                SCREEN

  screenBackgroundColorProperty: new ProfileColorProperty( 'screenBackgroundColor', {
    default: 'rgb(27,27,96)' // dark blue
  } ),

  //--------------------------------------------------------------------------
  //                                 Optic

  opticFillProperty: new ProfileColorProperty( 'opticFill', {
    default: 'rgb(100, 100, 245)'
  } ),

  opticStrokeProperty: new ProfileColorProperty( 'opticStroke', {
    default: 'rgb(255, 255, 255)'
  } ),


  //--------------------------------------------------------------------------
  //                                 FOCAL POINT

  focalPointFillProperty: new ProfileColorProperty( 'focalPointFill', {
    default: 'rgb(255, 255, 0)'
  } ),

  focalPointStrokeProperty: new ProfileColorProperty( 'focalPointStroke', {
    default: 'rgb(255, 255, 0)'
  } ),

  //--------------------------------------------------------------------------
  //                           OPTICAL AXIS

  opticalAxisStrokeProperty: new ProfileColorProperty( 'opticalAxisStroke', {
    default: 'rgb(133,133,182)'
  } ),

  //--------------------------------------------------------------------------
  //                             OBJECT

  secondSourcePointFillProperty: new ProfileColorProperty( 'secondSourcePointFill', {
    default: 'red'
  } ),
  secondSourcePointStrokeProperty: new ProfileColorProperty( 'secondSourcePointStroke', {
    default: 'black'
  } ),

  //--------------------------------------------------------------------------
  //                              RAYS

  virtualRayOneStrokeProperty: new ProfileColorProperty( 'virtualRayOneStroke', {
    default: 'rgb(59,177,122)'
  } ),

  virtualRayTwoStrokeProperty: new ProfileColorProperty( 'virtualRayTwoStroke', {
    default: 'rgb(238,106,205)'
  } ),

  realRayOneStrokeProperty: new ProfileColorProperty( 'realRayOneStroke', {
    default: 'rgb(160,226,195)'
  } ),

  realRayTwoStrokeProperty: new ProfileColorProperty( 'realRayTwoStroke', {
    default: 'rgb(255,207,232)'
  } ),

  //--------------------------------------------------------------------------
  //                     PROJECTOR SCREEN (BLACKBOARD)

  projectorScreenSpotlightFillProperty: new ProfileColorProperty( 'projectorScreenSpotlightFill', {
    default: 'yellow'
  } ),

  //--------------------------------------------------------------------------
  //                              LABELS

  labelBackgroundFillProperty: new ProfileColorProperty( 'labelBackgroundFill', {
    default: 'rgb(27,27,96)'
  } ),


  //--------------------------------------------------------------------------
  //                              GUIDES

  guidesFillProperty: new ProfileColorProperty( 'guidesFill', {
    default: 'rgb(255, 255, 0)'
  } ),
  guidesStrokeProperty: new ProfileColorProperty( 'guidesStroke', {
    default: 'rgb(255, 0, 0)'
  } ),

  //--------------------------------------------------------------------------
  //                           CONTROL PANEL

  panelStrokeProperty: new ProfileColorProperty( 'panelStroke', {
    default: 'rgb(217,205,205)'
  } ),
  panelFillProperty: new ProfileColorProperty( 'panelFill', {
    default: 'rgb(240,234,227)'
  } )

};

geometricOptics.register( 'geometricOpticsColorProfile', geometricOpticsColorProfile );
export default geometricOpticsColorProfile;
