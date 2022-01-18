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
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GOColors from '../GOColors.js';
import GOConstants from '../GOConstants.js';
import Optic from '../model/Optic.js';
import RaysModeType from '../model/RaysModeType.js';
import Representation from '../model/Representation.js';
import DiameterControl from './DiameterControl.js';
import RaysRadioButtonGroup from './RaysRadioButtonGroup.js';
import VisibilityCheckboxGroup from './VisibilityCheckboxGroup.js';
import VisibleProperties from './VisibleProperties.js';
import RadiusOfCurvatureControl from './RadiusOfCurvatureControl.js';
import IndexOfRefractionControl from './IndexOfRefractionControl.js';
import Lens from '../../lens/model/Lens.js';

type Options = {
  tandem: Tandem
};

class GOControlPanel extends Panel {

  /**
   * @param representationProperty
   * @param optic
   * @param raysModeProperty
   * @param visibleProperties
   * @param providedOptions
   */
  constructor( representationProperty: Property<Representation>, optic: Optic, raysModeProperty: Property<RaysModeType>,
               visibleProperties: VisibleProperties, providedOptions: Options ) {

    // Rays radio buttons ---------------------------------------------------------------------------------------

    const raysSubpanelTandem = providedOptions.tandem.createTandem( 'raysSubpanel' );

    // title
    const raysText = new Text( geometricOpticsStrings.rays, {
      font: GOConstants.TITLE_FONT,
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

    const opticSubpanelTandem = providedOptions.tandem.createTandem( 'opticSubpanel' );

    const opticSubpanelChildren = [];

    // Radius of Curvature
    opticSubpanelChildren.push( new RadiusOfCurvatureControl( optic.radiusOfCurvatureProperty, {
      tandem: opticSubpanelTandem.createTandem( 'radiusOfCurvatureControl' )
    } ) );

    // Index of Refraction (for lens only)
    if ( optic instanceof Lens ) {
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

    const checkboxGroup = new VisibilityCheckboxGroup( visibleProperties, ( optic instanceof Lens ), representationProperty, {
      tandem: providedOptions.tandem.createTandem( 'checkboxGroup' )
    } );

    // Put it all together ---------------------------------------------------------------------------------------

    // Vertical separators between sections of the control panel
    const separatorLength = Math.max( checkboxGroup.height, raysSubpanel.height );
    const separatorOptions = { stroke: 'gray', lineWidth: 1 };
    const leftSeparator = new VSeparator( separatorLength, merge( {
      tandem: providedOptions.tandem.createTandem( 'leftSeparator' )
    }, separatorOptions ) );
    const rightSeparator = new VSeparator( separatorLength, merge( {
      tandem: providedOptions.tandem.createTandem( 'rightSeparator' )
    }, separatorOptions ) );

    const content = new AlignBox( new HBox( {
        children: [ raysSubpanel, leftSeparator, opticSubpanel, rightSeparator, checkboxGroup ],
        spacing: 20,
        align: 'center'
      } ),
      { xAlign: 'left' }
    );

    super( content, merge( {

      // Panel options
      xMargin: 15,
      yMargin: 10,
      fill: GOColors.panelFillProperty,
      stroke: GOColors.panelStrokeProperty
    }, providedOptions ) );
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