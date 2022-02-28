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
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  focalLengthMagnitudeRange: RangeWithValue
  indexOfRefractionRange: RangeWithValue
};

type DirectFocalLengthModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class DirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  readonly radiusOfCurvatureMagnitudeProperty: IReadOnlyProperty<number>;
  readonly indexOfRefractionProperty: NumberProperty;
  readonly focalLengthMagnitudeProperty: NumberProperty;

  constructor( opticShapeProperty: IReadOnlyProperty<OpticShape>, providedOptions: DirectFocalLengthModelOptions ) {

    const options = optionize<DirectFocalLengthModelOptions, SelfOptions, PhetioObjectOptions>( {
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

    // fixed value
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
  }

  reset() {
    this.focalLengthMagnitudeProperty.reset();
    this.indexOfRefractionProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'DirectFocalLengthModel', DirectFocalLengthModel );
export default DirectFocalLengthModel;
export type { DirectFocalLengthModelOptions };