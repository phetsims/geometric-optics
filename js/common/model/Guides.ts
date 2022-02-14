// Copyright 2022, University of Colorado Boulder

/**
 * Guides is a pair of guides (top and bottom) associated with the same point-of-interest.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Optic from './Optic.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';

type GuidesOptions = {
  tandem: Tandem,
  phetioDocumentation: string
};

class Guides extends PhetioObject {

  public readonly topGuide: Guide;
  public readonly bottomGuide: Guide;

  /**
   * @param optic
   * @param opticalObjectPositionProperty
   * @param providedOptions
   */
  constructor( optic: Optic, opticalObjectPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: GuidesOptions ) {

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.topGuide = new Guide( optic, opticalObjectPositionProperty, 'top', {
      tandem: options.tandem.createTandem( 'topGuide' )
    } );

    this.bottomGuide = new Guide( optic, opticalObjectPositionProperty, 'bottom', {
      tandem: options.tandem.createTandem( 'bottomGuide' )
    } );
  }
}

geometricOptics.register( 'Guides', Guides );
export default Guides;