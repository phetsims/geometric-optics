// Copyright 2022, University of Colorado Boulder

/**
 * DirectFocalLengthModel is the model where focal length is set directly.
 * IOR is fixed, and ROC is derived from focal length and IOR.
 * See https://github.com/phetsims/geometric-optics/issues/255
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { OpticShape } from './OpticShape.js';
import FocalLengthModel from './FocalLengthModel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../geometricOptics.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  focalLengthMagnitudeRange: RangeWithValue;
  indexOfRefractionRange: RangeWithValue;
};

export type DirectFocalLengthModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class DirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  // see FocalLengthModel interface
  public readonly radiusOfCurvatureMagnitudeProperty: IReadOnlyProperty<number>;
  public readonly indexOfRefractionProperty: NumberProperty;
  public readonly focalLengthMagnitudeProperty: NumberProperty;

  // Resets things that are specific to this class.
  private readonly resetDirectFocalLengthModel: () => void;

  constructor( opticShapeProperty: IReadOnlyProperty<OpticShape>, providedOptions: DirectFocalLengthModelOptions ) {

    const options = optionize<DirectFocalLengthModelOptions, SelfOptions, PhetioObjectOptions>( {

      // PhetioObjectOptions
      phetioState: false,
      phetioDocumentation: 'Model of focal length that is used when ' +
                           `${GOGlobalOptions.focalLengthModelTypeProperty.tandem.phetioID} ` +
                           'is set to \'direct\'. Ignored for flat mirror. In this model:' +
                           '<ul>' +
                           '<li>focal length is settable' +
                           '<li>index of refraction is fixed' +
                           '<li>radius of curvature is derived' +
                           '</ul>'
    }, providedOptions );

    super( options );

    this.focalLengthMagnitudeProperty = new NumberProperty( options.focalLengthMagnitudeRange.defaultValue, {
      units: 'cm',
      range: options.focalLengthMagnitudeRange,
      tandem: options.tandem.createTandem( 'focalLengthMagnitudeProperty' ),
      phetioDocumentation: 'magnitude of the focal length (no sign)'
    } );

    assert && assert( options.indexOfRefractionRange?.getLength() === 0, 'indexOfRefraction should be a fixed value' );
    this.indexOfRefractionProperty = new NumberProperty( options.indexOfRefractionRange.defaultValue, {
      range: options.indexOfRefractionRange,
      // units: unitless
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' ),
      phetioReadOnly: true
    } );

    this.radiusOfCurvatureMagnitudeProperty = new DerivedProperty(
      [ opticShapeProperty, this.focalLengthMagnitudeProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShape, focalLengthMagnitude: number, indexOfRefraction: number ) =>
        focalLengthMagnitude * ( 2 * ( indexOfRefraction - 1 ) ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'radiusOfCurvatureMagnitudeProperty' ),
        phetioDocumentation: 'magnitude of the radius of curvature (no sign)',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    this.resetDirectFocalLengthModel = () => {
      this.focalLengthMagnitudeProperty.reset();
      this.indexOfRefractionProperty.reset();
    };
  }

  /**
   * Synchronizes with another focal-length model by copying the values that are settable in this model.
   * Constrain values so that floating-point error doesn't cause range exceptions.
   * @param model
   */
  public syncToModel( model: FocalLengthModel ): void {
    assert && assert( model !== this );
    assert && assert( this.focalLengthMagnitudeProperty.range ); // {Range|null}
    this.focalLengthMagnitudeProperty.value =
      this.focalLengthMagnitudeProperty.range!.constrainValue( model.focalLengthMagnitudeProperty.value );
  }

  public reset(): void {
    this.resetDirectFocalLengthModel();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'DirectFocalLengthModel', DirectFocalLengthModel );