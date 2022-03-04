// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOGlobalOptions defines the global options for this simulation, accessed via PhET > Options.
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

const GOGlobalOptions = {

  enable2FProperty: new BooleanProperty( GOQueryParameters.enable2F, {
    tandem: optionsTandem.createTandem( 'enable2FProperty' ),
    phetioDocumentation: 'enables the feature for showing the 2F points'
  } ),
  
  focalLengthModelTypeProperty:
    new Property<FocalLengthModelType>( GOQueryParameters.focalLengthControl, {
      validValues: FocalLengthModelTypeValues,
      tandem: optionsTandem.createTandem( 'focalLengthModelTypeProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
      phetioDocumentation: 'Determines how focal length is modeled and controlled in the Lens and Mirror screens.<br>' +
                           'This can also be set via the focalLengthControl query parameter.<br>' +
                           'The values are:' +
                           '<ul/>' +
                           '<li>direct: provides a control labeled \'Focal Length\'</li>' +
                           '<li>indirect: provides controls for other optic parameters, from which focal length is derived</li>' +
                           '</ul>'

    } )
};

geometricOptics.register( 'GOGlobalOptions', GOGlobalOptions );
export default GOGlobalOptions;