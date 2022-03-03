// Copyright 2022, University of Colorado Boulder

/**
 * IndirectFocalLengthModel is the model where focal length is set indirectly.
 * ROC and IOR are settable, and used to derive focal length.
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
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  radiusOfCurvatureMagnitudeRange: RangeWithValue,
  indexOfRefractionRange: RangeWithValue
};

export type IndirectFocalLengthModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class IndirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  // see FocalLengthModel interface
  public readonly radiusOfCurvatureMagnitudeProperty: NumberProperty;
  public readonly indexOfRefractionProperty: NumberProperty;
  public readonly focalLengthMagnitudeProperty: IReadOnlyProperty<number>;

  constructor( opticShapeProperty: IReadOnlyProperty<OpticShape>, providedOptions: IndirectFocalLengthModelOptions ) {

    const options = optionize<IndirectFocalLengthModelOptions, SelfOptions, PhetioObjectOptions>( {

      // PhetioObjectOptions
      phetioState: false,
      phetioDocumentation: 'Model of focal length that is used when ' +
                           `${GOGlobalOptions.focalLengthModelTypeProperty.tandem.phetioID} ` +
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
      [ opticShapeProperty, this.radiusOfCurvatureMagnitudeProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShape, radiusOfCurvatureMagnitude: number, indexOfRefraction: number ) =>
        radiusOfCurvatureMagnitude / ( 2 * ( indexOfRefraction - 1 ) ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'focalLengthMagnitudeProperty' ),
        phetioDocumentation: 'magnitude of the focal length (no sign)',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  public reset(): void {
    this.radiusOfCurvatureMagnitudeProperty.reset();
    this.indexOfRefractionProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'IndirectFocalLengthModel', IndirectFocalLengthModel );
export default IndirectFocalLengthModel;