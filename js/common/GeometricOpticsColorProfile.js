// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsColorProfile defines the color profile for this sim.
 *
 * @author Martin Veillette
 */

import ColorProfile from '../../../scenery-phet/js/ColorProfile.js';
import geometricOptics from '../geometricOptics.js';

const GeometricOpticsColorProfile = new ColorProfile( [ 'default' ], {


  //--------------------------------------------------------------------------
  //                                SCREEN

  screenBackgroundColor: {
    default: 'rgb(38, 0, 163)' // dark blue
  },

  //--------------------------------------------------------------------------
  //                                 LENS

  lensFill: {
    default: 'rgb(100, 100, 245)'
  },

  lensStroke: {
    default: 'rgb(255, 255, 255)'
  },

  lensMidStroke: {
    default: 'rgb(255, 255, 255)'
  },

  //--------------------------------------------------------------------------
  //                                 MIRROR

  mirrorFill: {
    default: 'rgb(100, 100, 245)'
  },

  mirrorStroke: {
    default: 'rgb(255, 255, 255)'
  },

  //--------------------------------------------------------------------------
  //                                 FOCAL POINT

  focalPointFill: {
    default: 'rgb(255, 255, 0)'
  },

  focalPointStroke: {
    default: 'rgb(255, 255, 255)'
  },

  //--------------------------------------------------------------------------
  //                           OPTICAL AXIS

  opticalAxisStroke: {
    default: 'rgb(0,255,247)'
  },

  //--------------------------------------------------------------------------
  //                             OBJECT

  movablePointFill: {
    default: 'rgb(255, 0, 0)'
  },
  movablePointStroke: {
    default: 'rgb(255, 0, 0)'
  },

  //--------------------------------------------------------------------------
  //                              RAYS

  virtualRayStroke: {
    default: 'rgb(0, 255, 0)'
  },

  realRayOneStroke: {
    default: 'rgb(255, 255, 255)'
  },

  realRayTwoStroke: {
    default: 'rgb(255, 255, 0)'
  },

  //--------------------------------------------------------------------------
  //                              SCREEN (BLACKBOARD)

  screenSpotlightFill: {
    default: 'yellow'
  },

  //--------------------------------------------------------------------------
  //                              GUIDES

  guidesFill: {
    default: 'rgb(255, 255, 0)'
  },
  guidesStroke: {
    default: 'rgb(255, 0, 0)'
  },

  //--------------------------------------------------------------------------
  //                           CONTROL PANEL

  panelStroke: {
    default: 'rgb( 190, 190, 190 )'
  },
  panelFill: {
    default: 'rgb( 240, 240, 240 )'
  }

} );

geometricOptics.register( 'GeometricOpticsColorProfile', GeometricOpticsColorProfile );
export default GeometricOpticsColorProfile;
