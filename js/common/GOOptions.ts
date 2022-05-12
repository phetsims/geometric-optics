// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOOptions defines the global options for this simulation, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import geometricOptics from '../geometricOptics.js';
import GOQueryParameters from './GOQueryParameters.js';
import { FocalLengthModelTypeValues } from './model/FocalLengthModelType.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import StringEnumerationProperty from '../../../axon/js/StringEnumerationProperty.js';

// constants
const optionsTandem = Tandem.GLOBAL_VIEW.createTandem( 'options' );

const GOOptions = {

  add2FPointsCheckboxProperty: new BooleanProperty( GOQueryParameters.add2FPointsCheckbox, {
    tandem: optionsTandem.createTandem( 'add2FPointsCheckboxProperty' ),
    phetioDocumentation: 'adds a "2F Points" checkbox to the control panels'
  } ),

  cueingArrowsEnabledProperty: new BooleanProperty( GOQueryParameters.cueingArrowsEnabled, {
    tandem: optionsTandem.createTandem( 'cueingArrowsEnabledProperty' ),
    phetioDocumentation: 'shows cueing arrows on draggable elements'
  } ),

  focalLengthModelTypeProperty:
    new StringEnumerationProperty( GOQueryParameters.focalLengthControl, {
      validValues: FocalLengthModelTypeValues,
      tandem: optionsTandem.createTandem( 'focalLengthModelTypeProperty' ),
      phetioDocumentation: 'Determines how focal length is modeled and controlled in the Lens and Mirror screens.<br>' +
                           'This can also be set via the focalLengthControl query parameter.<br>' +
                           'The values are:' +
                           '<ul/>' +
                           '<li>direct: provides a control labeled "Focal Length"</li>' +
                           '<li>indirect: provides controls for other optic parameters, from which focal length is derived</li>' +
                           '</ul>'

    } )
};

geometricOptics.register( 'GOOptions', GOOptions );
export default GOOptions;