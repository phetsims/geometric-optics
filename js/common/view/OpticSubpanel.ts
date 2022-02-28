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

const X_SPACING = 20; // horizontal space between control

class OpticSubpanel extends HBox {

  /**
   * @param optic
   * @param tandem
   */
  constructor( optic: Optic, tandem: Tandem ) {

    // Focal Length
    const focalLengthControl = new FocalLengthControl( optic.directFocalLengthModel.focalLengthMagnitudeProperty,
      optic.finiteFocalLengthProperty, {
        tandem: tandem.createTandem( 'focalLengthControl' )
      } );

    // Wrapper for controls related to the 'direct' focal-length model. This allows the sim to handle which controls
    // are visible for 'direct', while allowing the PhET-iO client to control focalLengthControl.visibleProperty.
    // See https://github.com/phetsims/geometric-optics/issues/347
    const directWrapperNode = new HBox( {
      children: [ focalLengthControl ],
      visibleProperty: new DerivedProperty( [ GOGlobalOptions.focalLengthModelTypeProperty, optic.opticShapeProperty ],
        ( focalLengthModelType: FocalLengthModelType, opticShape: OpticShape ) =>
          ( focalLengthModelType === 'direct' ) && ( opticShape !== 'flat' ) )
    } );

    // Children of indirectWrapperNode
    const indirectChildren = [];

    // Radius of Curvature
    const radiusOfCurvatureControl = new RadiusOfCurvatureControl(
      optic.indirectFocalLengthModel.radiusOfCurvatureMagnitudeProperty,
      optic.radiusOfCurvatureProperty, {
        tandem: tandem.createTandem( 'radiusOfCurvatureControl' )
      } );
    indirectChildren.push( radiusOfCurvatureControl );

    // Index of Refraction (for lens only)
    if ( optic instanceof Lens ) {
      const indexOfRefractionControl = new IndexOfRefractionControl( optic.indirectFocalLengthModel.indexOfRefractionProperty, {
        tandem: tandem.createTandem( 'indexOfRefractionControl' )
      } );
      indirectChildren.push( indexOfRefractionControl );
    }

    // Wrapper for controls related to the 'indirect' focal-length model. This allows the sim to handle which controls 
    // are visible for 'indirect', while allowing the PhET-iO client to control radiusOfCurvatureControl.visibleProperty
    // and indexOfRefractionControl.visibleProperty. See https://github.com/phetsims/geometric-optics/issues/347
    const indirectWrapperNode = new HBox( {
      children: indirectChildren,
      spacing: X_SPACING,
      visibleProperty: new DerivedProperty( [ GOGlobalOptions.focalLengthModelTypeProperty ],
        ( focalLengthModelType: FocalLengthModelType ) => ( focalLengthModelType === 'indirect' )
      )
    } );

    // Diameter
    const diameterControl = new DiameterControl( optic.diameterProperty, {
      tandem: tandem.createTandem( 'diameterControl' )
    } );

    super( {
      children: [ directWrapperNode, indirectWrapperNode, diameterControl ],
      spacing: X_SPACING,
      tandem: tandem
    } );
  }
}

geometricOptics.register( 'OpticSubpanel', OpticSubpanel );
export default OpticSubpanel;