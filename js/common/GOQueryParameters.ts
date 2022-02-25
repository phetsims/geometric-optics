// Copyright 2021-2022, University of Colorado Boulder

/**
 * Query parameters supported by the geometric-optics simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import geometricOptics from '../geometricOptics.js';
import { FocalLengthModelTypeValues } from './model/FocalLengthModelType.js';

const SCHEMA_MAP = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Add the 'Guides' feature to the Lens screen. This is a representation that was invented by PhET.
  // A checkbox will be added to the control panel, for controlling the visibility of the Guides.
  enableGuides: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },

  // Enable the feature that lets you show points at 2F.
  enable2F: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },

  // Enable the feature that shows cueing arrows on things that are draggable.
  enableCueingArrows: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // Determines how focal length is controlled in the Lens and Mirror screens.
  // direct: provides a control labeled 'Focal Length'
  // indirect: provides controls for optic parameters, from which focal length is derived
  focalLengthControl: {
    type: 'string',
    validValues: FocalLengthModelTypeValues,
    defaultValue: 'indirect',
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // speed of light in cm/sec, for the purpose of the light rays animation
  lightSpeed: {
    type: 'number',
    defaultValue: 400,
    isValidValue: ( value: number ) => ( value >= 100 )
  },

  // Range of opacity for arrow images, see https://github.com/phetsims/geometric-optics/issues/312
  arrowImageOpacityRange: {
    type: 'array',
    elementSchema: {
      type: 'number'
    },
    defaultValue: [ 0, 0.6 ],
    isValidValue: ( array: number[] ) => ( array.length === 2 && array[ 0 ] < array[ 1 ] && array[ 0 ] >= 0 && array[ 1 ] <= 1 )
  },

  // Range of opacity for framed images, see https://github.com/phetsims/geometric-optics/issues/232
  frameImageOpacityRange: {
   type: 'array',
    elementSchema: {
      type: 'number'
    },
    defaultValue: [ 0, 0.75 ],
    isValidValue: ( array: number[] ) => ( array.length === 2 && array[ 0 ] < array[ 1 ] && array[ 0 ] >= 0 && array[ 1 ] <= 1 )
  },

  // Opacity for the mask that sits behind the images associated with a framed object.
  // This determines how well we can see obscured parts of rays and the optical axis.
  frameImageMaskOpacity: {
    type: 'number',
    defaultValue: 0.8, // see https://github.com/phetsims/geometric-optics/issues/300
    isValidValue: ( value: number ) => ( value >= 0 && value <= 1 )
  },

  // Shows the positions of various things as red dots.
  debugOrigins: {
    type: 'flag'
  },

  // With framed objects and light objects, the optical axis has foreground and background Nodes.
  // This flag uses 'red' stroke for the foreground.
  debugOpticalAxis: {
    type: 'flag'
  },

  // With framed objects, real light rays are drawn using 2 Nodes, RealLightRaysNode and RealLightRaysForegroundNode.
  // This flag uses 'red' stroke for RealLightRaysForegroundNode and its clipArea.
  debugRays: {
    type: 'flag'
  },

  // Shows the model bounds as a red rectangle.
  debugModelBounds: {
    type: 'flag'
  },

  // Shows the Shape of the mask that sits behind the optical image associated with framed objects, rendered as
  // a red outline. This mask is used to reduce the opacity of the portion of the axis that is occluded by the
  // optical image. See ?imageMaskOpacity and https://github.com/phetsims/geometric-optics/issues/283.
  debugMask: {
    type: 'flag'
  }
};

const GOQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );
GOQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

geometricOptics.register( 'GOQueryParameters', GOQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GOQueryParameters' );

export default GOQueryParameters;