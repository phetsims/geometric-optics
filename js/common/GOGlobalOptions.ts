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
import { FocalLengthControlType, FocalLengthControlTypeValues } from './model/FocalLengthControlType.js';
import StringIO from '../../../tandem/js/types/StringIO.js';

// constants
const optionsTandem = Tandem.GLOBAL_VIEW.createTandem( 'options' );

const GOGlobalOptions = {

  focalLengthControlTypeProperty:
    new Property<FocalLengthControlType>( GOQueryParameters.focalLengthControl, {
      validValues: FocalLengthControlTypeValues,
      tandem: optionsTandem.createTandem( 'focalLengthControlTypeProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
      phetioDocumentation: 'Determines how focal length is controlled in the Lens and Mirror screens.<br>' +
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