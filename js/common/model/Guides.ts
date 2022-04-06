// Copyright 2022, University of Colorado Boulder

/**
 * Guides is a pair of guides (top and bottom) associated with the same point-of-interest.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Optic from './Optic.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type GuidesOptions = PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

class Guides extends PhetioObject {

  // the pair of guides
  public readonly topGuide: Guide;
  public readonly bottomGuide: Guide;

  /**
   * @param optic
   * @param opticalObjectPositionProperty
   * @param providedOptions
   */
  constructor( optic: Optic, opticalObjectPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: GuidesOptions ) {

    const options = optionize<GuidesOptions, {}, PhetioObjectOptions>( {

      // PhetioObjectOptions
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'Guides', Guides );
export default Guides;