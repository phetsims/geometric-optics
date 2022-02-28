// Copyright 2022, University of Colorado Boulder

/**
 * OpticSubpanel is a subpanel of the main control panel.
 * It has controls for optic parameters (ROC, IOR, focal length, diameter).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import { HBox } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import FocalLengthControl from './FocalLengthControl.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import { FocalLengthModelType } from '../model/FocalLengthModelType.js';
import { OpticShape } from '../model/OpticShape.js';
import RadiusOfCurvatureControl from './RadiusOfCurvatureControl.js';
import Lens from '../../lens/model/Lens.js';
import IndexOfRefractionControl from './IndexOfRefractionControl.js';
import DiameterControl from './DiameterControl.js';
import Optic from '../model/Optic.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

class OpticSubpanel extends HBox {

  /**
   * @param optic
   * @param tandem
   */
  constructor( optic: Optic, tandem: Tandem ) {

    const opticSubpanelChildren = [];

    // Focal Length
    opticSubpanelChildren.push( new FocalLengthControl( optic.directFocalLengthModel.focalLengthMagnitudeProperty,
      optic.finiteFocalLengthProperty, {
        visibleProperty: new DerivedProperty( [ GOGlobalOptions.focalLengthModelTypeProperty, optic.opticShapeProperty ], ( focalLengthModelType: FocalLengthModelType, opticShape: OpticShape ) =>
          ( focalLengthModelType === 'direct' ) && ( opticShape !== 'flat' ) ),
        tandem: tandem.createTandem( 'focalLengthControl' )
      } ) );

    // Radius of Curvature
    opticSubpanelChildren.push( new RadiusOfCurvatureControl(
      optic.indirectFocalLengthModel.radiusOfCurvatureMagnitudeProperty,
      optic.radiusOfCurvatureProperty, {
        visibleProperty: new DerivedProperty(
          [ GOGlobalOptions.focalLengthModelTypeProperty, optic.opticShapeProperty ],
          ( focalLengthModelType: FocalLengthModelType, opticShape: OpticShape ) =>
            ( focalLengthModelType === 'indirect' ) && ( opticShape !== 'flat' )
        ),
        tandem: tandem.createTandem( 'radiusOfCurvatureControl' )
      } ) );

    // Index of Refraction (for lens only)
    if ( optic instanceof Lens ) {
      opticSubpanelChildren.push( new IndexOfRefractionControl( optic.indirectFocalLengthModel.indexOfRefractionProperty, {
        visibleProperty: new DerivedProperty( [ GOGlobalOptions.focalLengthModelTypeProperty ],
          ( focalLengthModelType: FocalLengthModelType ) => ( focalLengthModelType === 'indirect' )
        ),
        tandem: tandem.createTandem( 'indexOfRefractionControl' )
      } ) );
    }

    // Diameter
    opticSubpanelChildren.push( new DiameterControl( optic.diameterProperty, {
      tandem: tandem.createTandem( 'diameterControl' )
    } ) );

    super( {
      children: opticSubpanelChildren,
      spacing: 20,
      tandem: tandem
    } );
  }
}

geometricOptics.register( 'OpticSubpanel', OpticSubpanel );
export default OpticSubpanel;