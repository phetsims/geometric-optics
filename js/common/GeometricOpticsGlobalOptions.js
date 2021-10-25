// Copyright 2018-2021, University of Colorado Boulder

/**
 * GeometricOpticsGlobalOptions defines the global options for this simulation, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../axon/js/StringProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import geometricOptics from '../geometricOptics.js';
import GeometricOpticsQueryParameters from './GeometricOpticsQueryParameters.js';

// constants
const optionsTandem = Tandem.GLOBAL_MODEL.createTandem( 'options' );

const GeometricOpticsGlobalOptions = {

  // @public
  focalLengthControlProperty:
    new StringProperty( GeometricOpticsQueryParameters.focalLengthControl, {
      tandem: optionsTandem.createTandem( 'focalLengthControlProperty' ),
      phetioDocumentation: 'Determines how focal length is controlled in the Lens and Mirror screens.'
    } )
};

geometricOptics.register( 'GeometricOpticsGlobalOptions', GeometricOpticsGlobalOptions );
export default GeometricOpticsGlobalOptions;