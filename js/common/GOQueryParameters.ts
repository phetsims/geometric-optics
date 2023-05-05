// Copyright 2021-2023, University of Colorado Boulder

/**
 * Query parameters supported by the geometric-optics simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import logGlobal from '../../../phet-core/js/logGlobal.js';
import geometricOptics from '../geometricOptics.js';
import { FocalLengthModelTypeValues } from './model/FocalLengthModelType.js';

const SCHEMA_MAP = {

  //----------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //----------------------------------------------------------------------------------------------------------------

  // When true, adds a 'Guides' checkbox to the control panel in the Lens screen.
  addGuidesCheckbox: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },

  // When true, adds a '2F Points' checkbox to the control panel in both screens.
  // This sets the initial value of GOOptions.add2FPointsCheckboxProperty.
  add2FPointsCheckbox: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },

  // Enables the feature that shows cueing arrows on things that are draggable.
  // This sets the initial value of GOOptions.cueingArrowsEnabledProperty.
  cueingArrowsEnabled: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // Determines how focal length is modeled and controlled in the Lens and Mirror screens.
  // This sets the value of GOOptions.focalLengthModelTypeProperty, but was named focalLengthControl to align
  // with the 'Focal Length control' label used in the Preferences dialog.
  // direct: provides a control labeled 'Focal Length'
  // indirect: provides controls for other optic parameters, from which focal length is derived
  focalLengthControl: {
    type: 'string',
    validValues: FocalLengthModelTypeValues,
    defaultValue: 'indirect',
    public: true
  },

  //----------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //----------------------------------------------------------------------------------------------------------------

  // Use this with ?fuzz to test a specific scene, for example ?ea&fuzz&scene=arrow.
  // The ComboBox for selecting the optical object will be populated with a single item related to that scene.
  // Using the null value ignores this query parameter and populates the ComboBox normally.
  // We discovered that framed objects were receiving 96% of the fuzz coverage, due to the fact that selecting from a
  // ComboBox requires 2 actions. So this query parameter is used by sim-specific CT test to fuzz the 'Arrow' and
  // 'Light' scenes specifically. See listContinuousTests.js and https://github.com/phetsims/geometric-optics/issues/397
  scene: {
    type: 'string',
    defaultValue: null,
    isValidValue: ( value: string | null ) => [ 'framed', 'arrow', 'light', null ].includes( value )
  },

  realRaysLineWidth: {
    type: 'number',
    defaultValue: 1.5,
    isValidValue: ( raysLineWidth: number ) => ( raysLineWidth > 0 )
  },

  virtualRaysLineWidth: {
    type: 'number',
    defaultValue: 2,
    isValidValue: ( raysLineWidth: number ) => ( raysLineWidth > 0 )
  },

  // radius of curvature (ROC) range for the Lens screen
  rocRangeLens: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 40, 120, 80 ),
    isValidValue: isPositiveIntegerRangeWithValue
  },

  // index of refraction (IOR) range for the Lens screen
  iorRangeLens: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 1.2, 1.8, 1.5 ),
    isValidValue: ( range: RangeWithValue ) => ( range.min > 0 )
  },

  // focal length (f) range for the Lens screen
  fRangeLens: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 40, 120, 80 ),
    isValidValue: isPositiveIntegerRangeWithValue
  },

  // diameter (D) range for the Lens screen
  dRangeLens: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 60, 120, 80 ),
    isValidValue: isPositiveIntegerRangeWithValue
  },

  // radius of curvature (ROC) range for the Mirror screen
  rocRangeMirror: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 150, 300, 180 ),
    isValidValue: isPositiveIntegerRangeWithValue
  },

  // focal length (f) range for the Mirror screen
  fRangeMirror: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 75, 150, 90 ),
    isValidValue: isPositiveIntegerRangeWithValue
  },

  // diameter (D) range for the Mirror screen
  dRangeMirror: {
    type: 'custom',
    parse: parseRangeWithValue,
    defaultValue: new RangeWithValue( 60, 120, 80 ),
    isValidValue: isPositiveIntegerRangeWithValue
  },

  // speed of light in cm/sec, for the purpose of the light rays animation
  lightSpeed: {
    type: 'number',
    defaultValue: 400,
    isValidValue: ( value: number ) => ( value >= 100 )
  },

  // Opacity for the mask that sits behind the image associated with a framed object.
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
  // The foreground Node draws the segments of the optical axis that are not obscured by things that have 3D perspective.
  // This flag uses 'red' stroke for the foreground Node and its clipArea.
  debugOpticalAxis: {
    type: 'flag'
  },

  // With framed objects, real light rays are drawn using foreground and background Nodes.
  // The foreground Node draws the parts of the rays that are not obscured by things that have 3D perspective.
  // This flag uses 'red' stroke for the foreground Node and its clipArea.
  debugRays: {
    type: 'flag'
  },

  // Shows the value of GOScreenView.sceneBoundsProperty as a red rectangle.
  debugSceneBounds: {
    type: 'flag'
  },

  // Shows the Shape of the mask that sits behind the optical image associated with framed objects, rendered as a red
  // outline. This mask is used to reduce the opacity of the portion of the axis that is occluded by the 3D perspective
  // of the optical image. See ?frameImageMaskOpacity and https://github.com/phetsims/geometric-optics/issues/283.
  debugMask: {
    type: 'flag'
  },

  // Shows the outline of the light spots, not clipped to the projections screen.
  debugLightSpots: {
    type: 'flag'
  }
} as const;

/**
 * Parses a query-parameter value into a RangeWithValue.
 */
function parseRangeWithValue( value: string ): RangeWithValue {
  const tokens = value.split( ',' );
  assert && assert( tokens.length === 3, `bad query-parameter value, range format is min,max,initial: ${value}` );
  assert && assert( _.every( tokens, ( token: number ) => isFinite( token ) ), `range must be 3 numbers: ${value}` );
  const numbers = _.map( tokens, token => parseFloat( token ) );
  return new RangeWithValue( numbers[ 0 ], numbers[ 1 ], numbers[ 2 ] );
}

function isPositiveIntegerRangeWithValue( range: RangeWithValue ): boolean {
  return Number.isInteger( range.min ) && ( range.min > 0 ) &&
         Number.isInteger( range.max ) && Number.isInteger( range.defaultValue );
}

const GOQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );
GOQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

geometricOptics.register( 'GOQueryParameters', GOQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.geometricOptics.GOQueryParameters' );

export default GOQueryParameters;