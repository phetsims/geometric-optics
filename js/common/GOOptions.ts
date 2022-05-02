// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOOptions defines the global options for this simulation, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Tandem from '../../../tandem/js/Tandem.js';
import geometricOptics from '../geometricOptics.js';
import GOQueryParameters from './GOQueryParameters.js';
import { FocalLengthModelType, FocalLengthModelTypeValues } from './model/FocalLengthModelType.js';
import StringIO from '../../../tandem/js/types/StringIO.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';

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

  //TODO https://github.com/phetsims/geometric-optics/issues/436 use StringEnumerationProperty
  focalLengthModelTypeProperty:
    new Property<FocalLengthModelType>( GOQueryParameters.focalLengthControl, {
      validValues: FocalLengthModelTypeValues,
      tandem: optionsTandem.createTandem( 'focalLengthModelTypeProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
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