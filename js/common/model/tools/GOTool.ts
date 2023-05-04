// Copyright 2022-2023, University of Colorado Boulder

/**
 * GOTool is the base class for all tools in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../../geometricOptics.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type GOToolOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class GOTool extends PhetioObject {

  // position of the tool, in cm
  public readonly positionProperty: Property<Vector2>;

  // whether the tool is in the toolbox
  public readonly isInToolboxProperty: Property<boolean>;

  // Resets things that are specific to this class.
  private readonly resetGOTool: () => void;

  protected constructor( providedOptions: GOToolOptions ) {

    const options = optionize<GOToolOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );

    this.isInToolboxProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isInToolboxProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Controls whether the tool is in the toolbox.'
    } );

    this.resetGOTool = () => {
      this.positionProperty.reset();
      this.isInToolboxProperty.reset();
    };
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGOTool();
  }
}

geometricOptics.register( 'GOTool', GOTool );
export { GOTool as default };