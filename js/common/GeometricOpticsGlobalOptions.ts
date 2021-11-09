// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsGlobalOptions defines the global options for this simulation, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Tandem from '../../../tandem/js/Tandem.js';
import geometricOptics from '../geometricOptics.js';
import GeometricOpticsQueryParameters from './GeometricOpticsQueryParameters.js';
import FocalLengthControlEnum, { FocalLengthControlValues } from './model/FocalLengthControlEnum.js';

// constants
const optionsTandem = Tandem.GLOBAL_VIEW.createTandem( 'options' );

const GeometricOpticsGlobalOptions = {

  focalLengthControlProperty:
    new Property<FocalLengthControlEnum>( GeometricOpticsQueryParameters.focalLengthControl, {
      validValues: FocalLengthControlValues,
      tandem: optionsTandem.createTandem( 'focalLengthControlProperty' ),
      phetioDocumentation: 'Determines how focal length is controlled in the Lens and Mirror screens.<br>' +
                           'direct: provides a control labeled \'Focal Length\'<br>' +
                           'indirect: provides controls for optic parameters, from which focal length is derived'
    } )
};

geometricOptics.register( 'GeometricOpticsGlobalOptions', GeometricOpticsGlobalOptions );
export default GeometricOpticsGlobalOptions;