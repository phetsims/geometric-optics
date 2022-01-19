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
import FocalLengthControlType, { FocalLengthControlTypeValues } from './model/FocalLengthControlType.js';
import StringIO from '../../../tandem/js/types/StringIO.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';

// constants
const optionsTandem = Tandem.GLOBAL_VIEW.createTandem( 'options' );

const GOGlobalOptions = {

  focalLengthControlProperty:
    new Property<FocalLengthControlType>( GOQueryParameters.focalLengthControl, {
      validValues: FocalLengthControlTypeValues,
      tandem: optionsTandem.createTandem( 'focalLengthControlProperty' ),
      phetioType: Property.PropertyIO( StringIO ),
      phetioDocumentation: 'Determines how focal length is controlled in the Lens and Mirror screens.<br>' +
                           'direct: provides a control labeled \'Focal Length\'<br>' +
                           'indirect: provides controls for optic parameters, from which focal length is derived'
    } ),

  cueingArrowsEnabledProperty: new BooleanProperty( true, {
    tandem: optionsTandem.createTandem( 'cueingArrowsEnabledProperty' ),
    phetioDocumentation: 'Use this Property to enable or disable the cueing arrows feature.<br>' +
                         'true: draggable Nodes will have cueing arrows<br>' +
                         'false: no cueing arrows will appear in the sim'
  } )
};

geometricOptics.register( 'GOGlobalOptions', GOGlobalOptions );
export default GOGlobalOptions;