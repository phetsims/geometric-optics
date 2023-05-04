// Copyright 2022-2023, University of Colorado Boulder

/**
 * OpticSubpanel is a subpanel of the main control panel.
 * It has controls for optic parameters (ROC, IOR, focal length, diameter).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import { HBox, Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import FocalLengthControl from './FocalLengthControl.js';
import GOPreferences from '../model/GOPreferences.js';
import RadiusOfCurvatureControl from './RadiusOfCurvatureControl.js';
import Lens from '../../lens/model/Lens.js';
import IndexOfRefractionControl from './IndexOfRefractionControl.js';
import DiameterControl from './DiameterControl.js';
import Optic from '../model/Optic.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const X_SPACING = 15; // horizontal space between control
const ALIGN = 'bottom'; // align bottoms of all NumberControls

export default class OpticSubpanel extends HBox {

  public constructor( optic: Optic, tandem: Tandem ) {

    const children = [];

    // An exclusively-flat mirror (as in the Basics version) has no controls for focal length.
    if ( !optic.isExclusivelyFlatMirror() ) {

      // Controls for 'direct' focal-length model
      children.push( new DirectFocalLengthControls( optic, tandem ) );

      // Controls for 'indirect' focal-length model
      children.push( new IndirectFocalLengthControls( optic, tandem ) );
    }

    // Diameter control, relevant for all optics
    const diameterControl = new DiameterControl( optic.diameterProperty, {
      tandem: tandem.createTandem( 'diameterControl' )
    } );
    children.push( diameterControl );

    super( {
      children: children,
      spacing: X_SPACING,
      align: ALIGN,
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      tandem: tandem
    } );
  }
}

/**
 * Wrapper for controls related to the 'direct' focal-length model. This allows the sim to handle which controls
 * are visible for 'direct', while allowing the PhET-iO client to control focalLengthControl.visibleProperty.
 * See https://github.com/phetsims/geometric-optics/issues/347
 */
class DirectFocalLengthControls extends Node {

  public constructor( optic: Optic, tandem: Tandem ) {

    // Focal Length
    const focalLengthControl = new FocalLengthControl( optic.directFocalLengthModel.focalLengthMagnitudeProperty,
      optic.focalLengthProperty, {
        tandem: tandem.createTandem( 'focalLengthControl' )
      } );

    super( {
      children: [ focalLengthControl ],
      visibleProperty: new DerivedProperty( [ GOPreferences.focalLengthModelTypeProperty, optic.opticSurfaceTypeProperty ],
        ( focalLengthModelType, opticSurfaceType ) =>
          ( focalLengthModelType === 'direct' ) && ( opticSurfaceType !== 'flat' ) )
      // no tandem, do not instrument!
    } );
  }
}

/**
 * Wrapper for controls related to the 'indirect' focal-length model. This allows the sim to handle which controls
 * are visible for 'indirect', while allowing the PhET-iO client to control radiusOfCurvatureControl.visibleProperty
 * and indexOfRefractionControl.visibleProperty. See https://github.com/phetsims/geometric-optics/issues/347
 */
class IndirectFocalLengthControls extends HBox {

  public constructor( optic: Optic, tandem: Tandem ) {

    const children = [];

    // Radius of Curvature
    const radiusOfCurvatureControl = new RadiusOfCurvatureControl(
      optic.indirectFocalLengthModel.radiusOfCurvatureMagnitudeProperty,
      optic.radiusOfCurvatureProperty, {
        tandem: tandem.createTandem( 'radiusOfCurvatureControl' )
      } );
    children.push( radiusOfCurvatureControl );

    // Index of Refraction (for lens only)
    if ( optic instanceof Lens ) {
      const indexOfRefractionControl = new IndexOfRefractionControl( optic.indirectFocalLengthModel.indexOfRefractionProperty, {
        tandem: tandem.createTandem( 'indexOfRefractionControl' )
      } );
      children.push( indexOfRefractionControl );
    }

    super( {
      children: children,
      spacing: X_SPACING,
      align: ALIGN,
      visibleProperty: new DerivedProperty( [ GOPreferences.focalLengthModelTypeProperty, optic.opticSurfaceTypeProperty ],
        ( focalLengthModelType, opticSurfaceType ) =>
          ( focalLengthModelType === 'indirect' ) && ( opticSurfaceType !== 'flat' )
      )
      // no tandem, do not instrument!
    } );
  }
}

geometricOptics.register( 'OpticSubpanel', OpticSubpanel );