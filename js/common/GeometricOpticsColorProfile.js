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
    default: 'rgb(27,27,96)' // dark blue
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
    default: 'rgb(100, 100, 245)'
  },

  //--------------------------------------------------------------------------
  //                             OBJECT

  movablePointFill: {
    default: 'red'
  },
  movablePointStroke: {
    default: 'black'
  },

  //--------------------------------------------------------------------------
  //                              RAYS

  virtualRayOneStroke: {
    default: 'rgb(6,191,60)'
  },

  virtualRayTwoStroke: {
    default: 'rgb(239,74,226)'
  },

  realRayOneStroke: {
    default: 'rgb(189,248,158)'
  },

  realRayTwoStroke: {
    default: 'rgb(255,207,232)'
  },

  //--------------------------------------------------------------------------
  //                     PROJECTOR SCREEN (BLACKBOARD)

  projectorScreenSpotlightFill: {
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
