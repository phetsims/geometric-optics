// Copyright 2021-2022, University of Colorado Boulder

/**
 * VisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type VisiblePropertiesOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

class VisibleProperties {

  // visibility of the focal points (F)
  readonly focalPointsVisibleProperty: Property<boolean>;

  // visibility of the 2F points
  readonly twoFPointsVisibleProperty: Property<boolean>;

  // visibility of the virtual Image, when present
  readonly virtualImageVisibleProperty: Property<boolean>;

  // visibility of the labels
  readonly labelsVisibleProperty: Property<boolean>;

  // visibility of the second optical object
  readonly secondPointVisibleProperty: Property<boolean>;

  // visibility of the guides, which are irrelevant for mirror
  readonly guidesVisibleProperty: Property<boolean>;

  // Determines whether the optical axis is visible.
  // PhET-iO only, cannot be controlled from the sim UI, and is not subject to reset.
  // See https://github.com/phetsims/geometric-optics/issues/252
  readonly opticalAxisVisibleProperty: Property<boolean>;

  // Resets things that are specific to this class.
  private readonly resetVisibleProperties: () => void;

  /**
   * @param isLens
   * @param providedOptions
   */
  constructor( isLens: boolean, providedOptions: VisiblePropertiesOptions ) {

    this.focalPointsVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'focalPointsVisibleProperty' )
    } );

    this.twoFPointsVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'twoFPointsVisibleProperty' )
    } );

    this.virtualImageVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'virtualImageVisibleProperty' )
    } );

    this.labelsVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'labelsVisibleProperty' )
    } );

    this.secondPointVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'secondPointVisibleProperty' )
    } );

    this.guidesVisibleProperty = new BooleanProperty( false, {
      validValues: isLens ? [ true, false ] : [ false ],
      tandem: providedOptions.tandem.createTandem( 'guidesVisibleProperty' )
    } );

    this.opticalAxisVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'opticalAxisVisibleProperty' ),
      phetioDocumentation: 'PhET-iO only, not settable in the sim'
    } );

    this.resetVisibleProperties = () => {
      this.focalPointsVisibleProperty.reset();
      this.twoFPointsVisibleProperty.reset();
      this.virtualImageVisibleProperty.reset();
      this.labelsVisibleProperty.reset();
      this.secondPointVisibleProperty.reset();
      this.guidesVisibleProperty.reset();
      // Do not reset opticalAxisVisibleProperty, it's PhET-iO only.
    };
  }

  public reset(): void {
    this.resetVisibleProperties();
  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;