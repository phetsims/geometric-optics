// Copyright 2021, University of Colorado Boulder

/**
 * MirrorModel is the model for the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOModel, { GeometricOpticsModelOptions } from '../../common/model/GOModel.js';
import { RepresentationStaticInstances } from '../../common/model/Representation.js';
import geometricOptics from '../../geometricOptics.js';
import Mirror from './Mirror.js';

type MirrorOptions = {
  tandem: Tandem
}

class MirrorModel extends GOModel {

  /**
   * @param providedOptions
   */
  constructor( providedOptions: MirrorOptions ) {

    const options = merge( {

      // Initial position of the source object, empirically set so that the entire framed object is above the optical axis
      sourceObjectPosition: new Vector2( -170, 63.5 ),

      // Mirror only supports objects, no light source
      representations: RepresentationStaticInstances.filter( value => value.isObject )
    }, providedOptions ) as GeometricOpticsModelOptions;

    const mirror = new Mirror( {
      tandem: options.tandem.createTandem( 'mirror' )
    } );

    super( mirror, options );
  }
}

geometricOptics.register( 'MirrorModel', MirrorModel );
export default MirrorModel;