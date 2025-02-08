// Copyright 2021-2025, University of Colorado Boulder

/**
 * GOControlPanel is the main control panel for both screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VSeparator from '../../../../scenery/js/layout/nodes/VSeparator.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import geometricOptics from '../../geometricOptics.js';
import { GOSimOptions } from '../../GOSim.js';
import GOColors from '../GOColors.js';
import Optic from '../model/Optic.js';
import OpticalObjectChoice from '../model/OpticalObjectChoice.js';
import { RaysType } from '../model/RaysType.js';
import OpticSubpanel from './OpticSubpanel.js';
import RaysSubpanel from './RaysSubpanel.js';
import VisibilityCheckboxGroup from './VisibilityCheckboxGroup.js';
import VisibleProperties from './VisibleProperties.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

type GOControlPanelOptions = SelfOptions & PickOptional<PanelOptions, 'bottom'> & PickRequired<PanelOptions, 'tandem'>;

export default class GOControlPanel extends Panel {

  /**
   * @param optic
   * @param raysTypeProperty - representation for rays
   * @param opticalObjectChoiceProperty
   * @param visibleProperties
   * @param providedOptions
   */
  public constructor( optic: Optic,
                      raysTypeProperty: Property<RaysType>,
                      opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>,
                      visibleProperties: VisibleProperties,
                      providedOptions: GOControlPanelOptions ) {

    const options = optionize<GOControlPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      isDisposable: false,
      xMargin: 15,
      yMargin: 10,
      fill: GOColors.panelFillProperty,
      stroke: GOColors.panelStrokeProperty,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const raysSubpanel = new RaysSubpanel( raysTypeProperty, options.tandem.createTandem( 'raysSubpanel' ) );

    const opticSubpanel = new OpticSubpanel( optic, options.tandem.createTandem( 'opticSubpanel' ) );

    const checkboxGroup = new VisibilityCheckboxGroup( visibleProperties, optic, opticalObjectChoiceProperty, {
      isBasicsVersion: options.isBasicsVersion,
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );

    // Vertical separators between sections of the control panel
    const leftSeparator = new VSeparator( {
      stroke: GOColors.panelSeparatorStrokeProperty
    } );
    const rightSeparator = new VSeparator( {
      stroke: GOColors.panelSeparatorStrokeProperty
    } );

    const content = new HBox( {
      children: [ raysSubpanel, leftSeparator, opticSubpanel, rightSeparator, checkboxGroup ],
      spacing: 15,
      align: 'center'
    } );

    super( content, options );
  }
}

geometricOptics.register( 'GOControlPanel', GOControlPanel );