// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOControlPanel is the main control panel for both screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import { HBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import VSeparator from '../../../../sun/js/VSeparator.js';
import geometricOptics from '../../geometricOptics.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import { RaysType } from '../model/RaysType.js';
import VisibilityCheckboxGroup from './VisibilityCheckboxGroup.js';
import VisibleProperties from './VisibleProperties.js';
import Lens from '../../lens/model/Lens.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Mirror from '../../mirror/model/Mirror.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import RaysSubpanel from './RaysSubpanel.js';
import OpticSubpanel from './OpticSubpanel.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { GOSimOptions } from '../../GOSim.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type GOControlPanelOptions = SelfOptions & PickOptional<PanelOptions, 'bottom'> & PickRequired<PanelOptions, 'tandem'>;

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

      // PanelOptions
      xMargin: 15,
      yMargin: 10,
      fill: GOColors.panelFillProperty,
      stroke: GOColors.panelStrokeProperty
    }, providedOptions );

    const raysSubpanel = new RaysSubpanel( raysTypeProperty, options.tandem.createTandem( 'raysSubpanel' ) );

    const opticSubpanel = new OpticSubpanel( optic, options.tandem.createTandem( 'opticSubpanel' ) );

    const checkboxGroup = new VisibilityCheckboxGroup( ( optic instanceof Lens ), visibleProperties,
      virtualImageCheckboxEnabledProperty, {
        isBasicsVersion: options.isBasicsVersion,
        isMirrorScreen: ( optic instanceof Mirror ),
        tandem: options.tandem.createTandem( 'checkboxGroup' )
      } );

    // Vertical separators between sections of the control panel
    const separatorLength = Math.max( checkboxGroup.height, raysSubpanel.height );
    const leftSeparator = new VSeparator( separatorLength, {
      stroke: GOColors.panelSeparatorStrokeProperty,
      tandem: options.tandem.createTandem( 'leftSeparator' )
    } );
    const rightSeparator = new VSeparator( separatorLength, {
      stroke: GOColors.panelSeparatorStrokeProperty,
      tandem: options.tandem.createTandem( 'rightSeparator' )
    } );

    const content = new HBox( {
      children: [ raysSubpanel, leftSeparator, opticSubpanel, rightSeparator, checkboxGroup ],
      spacing: 15,
      align: 'center'
    } );

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