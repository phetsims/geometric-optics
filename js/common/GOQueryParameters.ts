// Copyright 2021-2022, University of Colorado Boulder

/**
 * Query parameters supported by the geometric-optics simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import geometricOptics from '../geometricOptics.js';
import { FocalLengthControlValues } from './model/FocalLengthControlType.js';

const SCHEMA = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Add the 'Guides' feature to the Lens screen. This is a representation that was invented by PhET.
  // A checkbox will be added to the control panel, for controlling the visibility of the Guides.
  enableGuides: {
    type: 'flag',
    public: true
  },

  // Determines how focal length is controlled in the Lens and Mirror screens.
  // direct: provides a control labeled 'Focal Length'
  // indirect: provides controls for optic parameters, from which focal length is derived
  focalLengthControl: {
    type: 'string',
    validValues: FocalLengthControlValues,
    defaultValue: 'indirect',
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Enable the feature that lets you show points at 2F.
  enable2F: {
    type: 'boolean',
    defaultValue: false
  },

  // speed of light in cm/sec, for the purpose of the light rays animation
  lightSpeed: {
    type: 'number',
    defaultValue: 400,
    isValidValue: ( value: number ) => ( value >= 100 )
  },

  // Shows the positions of various things as red dots.
  debugOrigins: {
    type: 'flag'
  },

  // The optical axis is drawn using 2 Nodes, OpticalAxisNode and OpticalAxisForegroundNode.
  // This flag uses 'red' stroke for OpticalAxisForegroundNode and its clipArea.
  debugOpticalAxis: {
    type: 'flag'
  },

  // The light rays are drawn using 2 Nodes, LightRaysNode and LightRaysForegroundNode.
  // This flag uses 'red' stroke for LightRaysForegroundNode and its clipArea.
  debugRays: {
    type: 'flag'
  },

  // Shows the model bounds as a green rectangle.
  debugModelBounds: {
    type: 'flag'
  },

  // Shows the Shape of the mask that sits behind the framed objects, rendered as a red outline.
  // This mask is used to reduce the opacity of the portion of the axis that is occluded by the
  // real or virtual image. See https://github.com/phetsims/geometric-optics/issues/283.
  debugMask: {
    type: 'flag'
  }
};

const GOQueryParameters = QueryStringMachine.getAll( SCHEMA );
GOQueryParameters.SCHEMA = SCHEMA;

geometricOptics.register( 'GOQueryParameters', GOQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GOQueryParameters' );

export default GOQueryParameters;