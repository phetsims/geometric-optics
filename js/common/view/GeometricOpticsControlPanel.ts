// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsControlPanel is the main control panel for both screens.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import VSeparator from '../../../../sun/js/VSeparator.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsColors from '../GeometricOpticsColors.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import Optic from '../model/Optic.js';
import RaysModeEnum from '../model/RaysModeEnum.js';
import Representation from '../model/Representation.js';
import DiameterControl from './DiameterControl.js';
import RaysRadioButtonGroup from './RaysRadioButtonGroup.js';
import VisibilityCheckboxGroup from './VisibilityCheckboxGroup.js';
import VisibleProperties from './VisibleProperties.js';
import RadiusOfCurvatureControl from './RadiusOfCurvatureControl.js';
import IndexOfRefractionControl from './IndexOfRefractionControl.js';

class GeometricOpticsControlPanel extends Panel {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {Optic} optic
   * @param {Property.<RaysModeEnum>} raysModeProperty
   * @param {VisibleProperties} visibleProperties
   * @param {Object} [options]
   */
  constructor( representationProperty: Property<Representation>, optic: Optic, raysModeProperty: Property<RaysModeEnum>,
               visibleProperties: VisibleProperties, options?: any ) { //TYPESCRIPT any

    options = merge( {

      // Panel options
      xMargin: 15,
      yMargin: 10,
      fill: GeometricOpticsColors.panelFillProperty,
      stroke: GeometricOpticsColors.panelStrokeProperty,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Rays radio buttons ---------------------------------------------------------------------------------------

    const raysSubpanelTandem = options.tandem.createTandem( 'raysSubpanel' );

    // title
    const raysText = new Text( geometricOpticsStrings.rays, {
      font: GeometricOpticsConstants.TITLE_FONT,
      maxWidth: 100,
      tandem: raysSubpanelTandem.createTandem( 'raysText' )
    } );

    // radio buttons
    const raysRadioButtonGroup = new RaysRadioButtonGroup( raysModeProperty, {
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

    // Radius of Curvature
    opticSubpanelChildren.push( new RadiusOfCurvatureControl( optic.radiusOfCurvatureProperty, {
      tandem: opticSubpanelTandem.createTandem( 'radiusOfCurvatureControl' )
    } ) );

    // Index of Refraction (for lens only)
    if ( optic.opticType === 'lens' ) {
      opticSubpanelChildren.push( new IndexOfRefractionControl( optic.indexOfRefractionProperty, {
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

    const checkboxGroup = new VisibilityCheckboxGroup( visibleProperties, optic.opticType, representationProperty, {
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );

    // Put it all together ---------------------------------------------------------------------------------------

    // Vertical separators between sections of the control panel
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

geometricOptics.register( 'GeometricOpticsControlPanel', GeometricOpticsControlPanel );
export default GeometricOpticsControlPanel;