// Copyright 2022, University of Colorado Boulder

/**
 * IndirectFocalLengthModel is the model where focal length is set indirectly.
 * ROC and IOR are settable, and used to derive focal length.
 * See https://github.com/phetsims/geometric-optics/issues/255
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { OpticSurfaceType } from './OpticSurfaceType.js';
import FocalLengthModel from './FocalLengthModel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../geometricOptics.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GOOptions from '../GOOptions.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  radiusOfCurvatureMagnitudeRange: RangeWithValue;
  indexOfRefractionRange: RangeWithValue;
};

export type IndirectFocalLengthModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class IndirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  // see FocalLengthModel
  public readonly radiusOfCurvatureMagnitudeProperty: NumberProperty;
  public readonly indexOfRefractionProperty: NumberProperty;
  public readonly focalLengthMagnitudeProperty: IReadOnlyProperty<number>;

  // Resets things that are specific to this class.
  private readonly resetIndirectFocalLengthModel: () => void;

  public constructor( opticSurfaceTypeProperty: IReadOnlyProperty<OpticSurfaceType>,
                      providedOptions: IndirectFocalLengthModelOptions ) {

    const options = optionize<IndirectFocalLengthModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false,
      phetioDocumentation: 'Model of focal length that is used when ' +
                           `${GOOptions.focalLengthModelTypeProperty.tandem.phetioID} ` +
                           'is set to \'indirect\'. Ignored for flat mirror. In this model:' +
                           '<ul>' +
                           '<li>radius of curvature and index of refraction are settable' +
                           '<li>focal length is derived' +
                           '</ul>'
    }, providedOptions );

    super( options );

    this.radiusOfCurvatureMagnitudeProperty = new NumberProperty( options.radiusOfCurvatureMagnitudeRange.defaultValue, {
      units: 'cm',
      range: options.radiusOfCurvatureMagnitudeRange,
      tandem: options.tandem.createTandem( 'radiusOfCurvatureMagnitudeProperty' ),
      phetioDocumentation: 'magnitude of the radius of curvature (no sign)'
    } );

    this.indexOfRefractionProperty = new NumberProperty( options.indexOfRefractionRange.defaultValue, {
      // units: unitless
      range: options.indexOfRefractionRange,
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' )
    } );

    this.focalLengthMagnitudeProperty = new DerivedProperty(
      [ opticSurfaceTypeProperty, this.radiusOfCurvatureMagnitudeProperty, this.indexOfRefractionProperty ],
      ( opticSurfaceType, radiusOfCurvatureMagnitude, indexOfRefraction ) =>
        radiusOfCurvatureMagnitude / ( 2 * ( indexOfRefraction - 1 ) ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'focalLengthMagnitudeProperty' ),
        phetioDocumentation: 'magnitude of the focal length (no sign)',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    this.resetIndirectFocalLengthModel = () => {
      this.radiusOfCurvatureMagnitudeProperty.reset();
      this.indexOfRefractionProperty.reset();
    };
  }

  /**
   * Synchronizes with another focal-length model by copying the values that are settable in this model.
   * Constrain values so that floating-point error doesn't cause range exceptions.
   */
  public syncToModel( model: FocalLengthModel ): void {
    assert && assert( model !== this );

    assert && assert( this.radiusOfCurvatureMagnitudeProperty.range ); // {Range|null}
    this.radiusOfCurvatureMagnitudeProperty.value =
      this.radiusOfCurvatureMagnitudeProperty.range!.constrainValue( model.radiusOfCurvatureMagnitudeProperty.value );

    assert && assert( this.indexOfRefractionProperty.range ); // {Range|null}
    this.indexOfRefractionProperty.value =
      this.indexOfRefractionProperty.range!.constrainValue( model.indexOfRefractionProperty.value );
  }

  public reset(): void {
    this.resetIndirectFocalLengthModel();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'IndirectFocalLengthModel', IndirectFocalLengthModel );