// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOControlPanel is the main control panel for both screens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignBox, HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import VSeparator from '../../../../sun/js/VSeparator.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOColors from '../GOColors.js';
import GOConstants from '../GOConstants.js';
import Optic from '../model/Optic.js';
import { RaysType } from '../model/RaysType.js';
import DiameterControl from './DiameterControl.js';
import RaysRadioButtonGroup from './RaysRadioButtonGroup.js';
import VisibilityCheckboxGroup from './VisibilityCheckboxGroup.js';
import VisibleProperties from './VisibleProperties.js';
import RadiusOfCurvatureControl from './RadiusOfCurvatureControl.js';
import IndexOfRefractionControl from './IndexOfRefractionControl.js';
import Lens from '../../lens/model/Lens.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import FocalLengthControl from './FocalLengthControl.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { FocalLengthModelType } from '../model/FocalLengthModelType.js';
import { OpticShape } from '../model/OpticShape.js';
import Mirror from '../../mirror/model/Mirror.js';
import { PickRequired } from '../GOTypes.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  isBasicsVersion: boolean
};

type GOControlPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

class GOControlPanel extends Panel {

  /**
   * @param optic
   * @param raysTypeProperty
   * @param visibleProperties
   * @param virtualImageCheckboxEnabledProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               raysTypeProperty: Property<RaysType>,
               visibleProperties: VisibleProperties,
               virtualImageCheckboxEnabledProperty: IReadOnlyProperty<boolean>,
               providedOptions: GOControlPanelOptions ) {

    const options = optionize<GOControlPanelOptions, SelfOptions, PanelOptions>( {

      // Panel options
      xMargin: 15,
      yMargin: 10,
      fill: GOColors.panelFillProperty,
      stroke: GOColors.panelStrokeProperty
    }, providedOptions );

    // Rays radio buttons ---------------------------------------------------------------------------------------

    const raysSubpanelTandem = options.tandem.createTandem( 'raysSubpanel' );

    // title
    const raysText = new Text( geometricOpticsStrings.rays, {
      font: GOConstants.TITLE_FONT,
      maxWidth: 100,
      tandem: raysSubpanelTandem.createTandem( 'raysText' )
    } );

    // radio buttons
    const raysRadioButtonGroup = new RaysRadioButtonGroup( raysTypeProperty, {
      tandem: raysSubpanelTandem.createTandem( 'raysRadioButtonGroup' )
    } );

    // title + radio buttons
    const raysSubpanel = new VBox( {
      children: [ raysText, raysRadioButtonGroup ],
      align: 'left',
      spacing: 4,
      tandem: raysSubpanelTandem
    } );

    // Lens/Mirror controls ---------------------------------------------------------------------------------------

    const opticSubpanelTandem = options.tandem.createTandem( 'opticSubpanel' );

    const opticSubpanelChildren = [];

    // Focal Length
    opticSubpanelChildren.push( new FocalLengthControl( optic.directFocalLengthModel.focalLengthMagnitudeProperty,
      optic.finiteFocalLengthProperty, {
        visibleProperty: new DerivedProperty(
          [ GOGlobalOptions.focalLengthModelTypeProperty, optic.opticShapeProperty ],
          ( focalLengthModelType: FocalLengthModelType, opticShape: OpticShape ) =>
            ( focalLengthModelType === 'direct' ) && ( opticShape !== 'flat' )
        ),
        tandem: opticSubpanelTandem.createTandem( 'focalLengthControl' )
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
        tandem: opticSubpanelTandem.createTandem( 'radiusOfCurvatureControl' )
      } ) );

    // Index of Refraction (for lens only)
    if ( optic instanceof Lens ) {
      opticSubpanelChildren.push( new IndexOfRefractionControl( optic.indirectFocalLengthModel.indexOfRefractionProperty, {
        visibleProperty: new DerivedProperty( [ GOGlobalOptions.focalLengthModelTypeProperty ],
          ( focalLengthModelType: FocalLengthModelType ) => ( focalLengthModelType === 'indirect' )
        ),
        tandem: opticSubpanelTandem.createTandem( 'indexOfRefractionControl' )
      } ) );
    }

    // Diameter
    opticSubpanelChildren.push( new DiameterControl( optic.diameterProperty, {
      tandem: opticSubpanelTandem.createTandem( 'diameterControl' )
    } ) );

    const opticSubpanel = new HBox( {
      children: opticSubpanelChildren,
      spacing: 20,
      tandem: opticSubpanelTandem
    } );

    // Visibility checkboxes ---------------------------------------------------------------------------------------

    const checkboxGroup = new VisibilityCheckboxGroup( ( optic instanceof Lens ), visibleProperties,
      virtualImageCheckboxEnabledProperty, {
        isBasicsVersion: options.isBasicsVersion,
        isMirrorScreen: ( optic instanceof Mirror ),
        tandem: options.tandem.createTandem( 'checkboxGroup' )
      } );

    // Put it all together ---------------------------------------------------------------------------------------

    // Vertical separators between sections of the control panel
    //TODO https://github.com/phetsims/geometric-optics/issues/326 convert to optionize when VSeparatorOptions exists
    const separatorLength = Math.max( checkboxGroup.height, raysSubpanel.height );
    const separatorOptions = { stroke: 'gray', lineWidth: 1 };
    const leftSeparator = new VSeparator( separatorLength, merge( {
      tandem: options.tandem.createTandem( 'leftSeparator' )
    }, separatorOptions ) );
    const rightSeparator = new VSeparator( separatorLength, merge( {
      tandem: options.tandem.createTandem( 'rightSeparator' )
    }, separatorOptions ) );

    const content = new AlignBox( new HBox( {
        children: [ raysSubpanel, leftSeparator, opticSubpanel, rightSeparator, checkboxGroup ],
        spacing: 20,
        align: 'center'
      } ),
      { xAlign: 'left' }
    );

    super( content, options );
  }

  /**
   * @override
   */
  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOControlPanel', GOControlPanel );
export default GOControlPanel;