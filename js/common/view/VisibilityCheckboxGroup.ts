// Copyright 2021-2022, University of Colorado Boulder

/**
 * VisibilityCheckboxGroup is a group of checkboxes for controlling visibility of things in the user interface.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GuideNode from './GuideNode.js';
import GOConstants from '../GOConstants.js';
import VisibleProperties from './VisibleProperties.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import SecondPointNode from './SecondPointNode.js';
import FocalPointNode from './FocalPointNode.js';
import TwoFPointNode from './TwoFPointNode.js';
import GOOptions from '../GOOptions.js';
import GOQueryParameters from '../GOQueryParameters.js';
import IProperty from '../../../../axon/js/IProperty.js';
import { GOSimOptions } from '../../GOSim.js';
import Optic from '../model/Optic.js';
import Lens from '../../lens/model/Lens.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

export type VisibilityCheckboxGroupOptions = SelfOptions & PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

export default class VisibilityCheckboxGroup extends VerticalCheckboxGroup {

  /**
   * @param visibleProperties - Properties controlled by these check boxes
   * @param optic
   * @param virtualImageCheckboxEnabledProperty - is the 'Virtual Image' check box enabled?
   * @param providedOptions
   */
  constructor( visibleProperties: VisibleProperties,
               optic: Optic,
               virtualImageCheckboxEnabledProperty: IReadOnlyProperty<boolean>,
               providedOptions: VisibilityCheckboxGroupOptions ) {

    const options = optionize<VisibilityCheckboxGroupOptions, {}, VerticalCheckboxGroupOptions>()( {

      // VerticalCheckboxGroupOptions
      spacing: 4,
      checkboxOptions: {
        boxWidth: GOConstants.CHECKBOX_BOX_WIDTH
      }
    }, providedOptions );

    // These checkboxes are not present in Geometric Optics: Basics, because it only has a flat mirror, with infinite
    // focal length. See https://github.com/phetsims/geometric-optics-basics/issues/2#issuecomment-998203690
    const focalPointItems = optic.isExclusivelyFlatMirror() ? [] : [

      // Focal Points (F)
      createItem( geometricOpticsStrings.checkbox.focalPoints, visibleProperties.focalPointsVisibleProperty, {
        iconNode: FocalPointNode.createIcon(),
        tandem: options.tandem.createTandem( 'focalPointsCheckbox' )
      } ),

      // 2F Points
      createItem( geometricOpticsStrings.checkbox.twoFPoints, visibleProperties.twoFPointsVisibleProperty, {
        iconNode: TwoFPointNode.createIcon(),
        options: {
          visibleProperty: GOOptions.add2FPointsCheckboxProperty
        },
        tandem: options.tandem.createTandem( 'twoFPointsCheckbox' )
      } )
    ];

    const items = [
      ...focalPointItems,

      // Virtual Image
      createItem( geometricOpticsStrings.checkbox.virtualImage, visibleProperties.virtualImageVisibleProperty, {
        options: {
          enabledProperty: virtualImageCheckboxEnabledProperty
        },
        tandem: options.tandem.createTandem( 'virtualImageCheckbox' )
      } ),

      // Labels
      createItem( geometricOpticsStrings.checkbox.labels, visibleProperties.labelsVisibleProperty, {
        tandem: options.tandem.createTandem( 'labelsCheckbox' )
      } ),

      // Second Point
      createItem( geometricOpticsStrings.checkbox.secondPoint, visibleProperties.secondPointVisibleProperty, {
        iconNode: SecondPointNode.createIcon(),
        options: {
          visible: !options.isBasicsVersion
        },
        tandem: options.tandem.createTandem( 'secondPointCheckbox' )
      } )
    ];

    // Guides
    if ( optic instanceof Lens ) {
      items.push( createItem( geometricOpticsStrings.checkbox.guides, visibleProperties.guidesVisibleProperty, {
        iconNode: GuideNode.createIcon(),
        options: {
          visible: GOQueryParameters.addGuidesCheckbox
        },
        tandem: options.tandem.createTandem( 'guidesCheckbox' )
      } ) );
    }

    super( items, options );
  }
}

type ItemOptions = {
  iconNode?: Node;
} & PickRequired<VerticalCheckboxGroupItem, 'tandem'> & PickOptional<VerticalCheckboxGroupItem, 'options'>;

function createItem( string: string, property: IProperty<boolean>, providedOptions: ItemOptions ): VerticalCheckboxGroupItem {

  const labelText = new Text( string, {
    font: GOConstants.CONTROL_FONT,
    maxWidth: 90,
    tandem: providedOptions.tandem.createTandem( 'labelText' ),
    phetioVisiblePropertyInstrumented: false
  } );

  // Create HBox if icon is present, otherwise the label is just text.
  const labelNode = providedOptions.iconNode ?
                    new HBox( { children: [ labelText, providedOptions.iconNode ], spacing: 8 } ) :
                    labelText;

  return {
    node: labelNode,
    property: property,
    options: providedOptions.options,
    tandem: providedOptions.tandem
  };
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );