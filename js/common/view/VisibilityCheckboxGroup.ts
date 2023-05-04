// Copyright 2021-2023, University of Colorado Boulder

/**
 * VisibilityCheckboxGroup is a group of checkboxes for controlling visibility of things in the user interface.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsStrings from '../../GeometricOpticsStrings.js';
import GuideNode from './GuideNode.js';
import GOConstants from '../GOConstants.js';
import VisibleProperties from './VisibleProperties.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import SecondPointNode from './SecondPointNode.js';
import FocalPointNode from './FocalPointNode.js';
import TwoFPointNode from './TwoFPointNode.js';
import GOPreferences from '../model/GOPreferences.js';
import GOQueryParameters from '../GOQueryParameters.js';
import { GOSimOptions } from '../../GOSim.js';
import Optic from '../model/Optic.js';
import Lens from '../../lens/model/Lens.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = PickRequired<GOSimOptions, 'isBasicsVersion'>;

export type VisibilityCheckboxGroupOptions = SelfOptions & PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

export default class VisibilityCheckboxGroup extends VerticalCheckboxGroup {

  /**
   * @param visibleProperties - Properties controlled by these check boxes
   * @param optic
   * @param virtualImageCheckboxEnabledProperty - is the 'Virtual Image' check box enabled?
   * @param providedOptions
   */
  public constructor( visibleProperties: VisibleProperties,
                      optic: Optic,
                      virtualImageCheckboxEnabledProperty: TReadOnlyProperty<boolean>,
                      providedOptions: VisibilityCheckboxGroupOptions ) {

    const options = optionize<VisibilityCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {

      // VerticalCheckboxGroupOptions
      spacing: 4,
      checkboxOptions: {
        boxWidth: GOConstants.CHECKBOX_BOX_WIDTH
      },
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // These checkboxes are not present in Geometric Optics: Basics, because it only has a flat mirror, with infinite
    // focal length. See https://github.com/phetsims/geometric-optics-basics/issues/2#issuecomment-998203690
    const focalPointItems = optic.isExclusivelyFlatMirror() ? [] : [

      // Focal Points (F)
      createItem( GeometricOpticsStrings.checkbox.focalPointsStringProperty, visibleProperties.focalPointsVisibleProperty, {
        iconNode: FocalPointNode.createIcon(),
        tandemName: 'focalPointsCheckbox'
      } ),

      // 2F Points
      createItem( GeometricOpticsStrings.checkbox.twoFPointsStringProperty, visibleProperties.twoFPointsVisibleProperty, {
        iconNode: TwoFPointNode.createIcon(),
        options: {
          visibleProperty: GOPreferences.add2FPointsCheckboxProperty
        },
        tandemName: 'twoFPointsCheckbox'
      } )
    ];

    const items = [
      ...focalPointItems,

      // Virtual Image
      createItem( GeometricOpticsStrings.checkbox.virtualImageStringProperty, visibleProperties.virtualImageVisibleProperty, {
        options: {
          enabledProperty: virtualImageCheckboxEnabledProperty
        },
        tandemName: 'virtualImageCheckbox'
      } ),

      // Labels
      createItem( GeometricOpticsStrings.checkbox.labelsStringProperty, visibleProperties.labelsVisibleProperty, {
        tandemName: 'labelsCheckbox'
      } ),

      // Second Point
      createItem( GeometricOpticsStrings.checkbox.secondPointStringProperty, visibleProperties.secondPointVisibleProperty, {
        iconNode: SecondPointNode.createIcon(),
        options: {
          visible: !options.isBasicsVersion // 'Second Point' checkbox is hidden in the Basics version
        },
        tandemName: 'secondPointCheckbox'
      } )
    ];

    // Guides
    if ( optic instanceof Lens ) {
      items.push( createItem( GeometricOpticsStrings.checkbox.guidesStringProperty, visibleProperties.guidesVisibleProperty, {
        iconNode: GuideNode.createIcon(),
        options: {
          visible: GOQueryParameters.addGuidesCheckbox,
          visiblePropertyOptions: {
            phetioFeatured: false
          },
          enabledPropertyOptions: {
            phetioFeatured: false
          }
        },
        tandemName: 'guidesCheckbox'
      } ) );
    }

    super( items, options );
  }
}

type ItemOptions = {
  iconNode?: Node;
} & PickRequired<VerticalCheckboxGroupItem, 'tandemName'> & PickOptional<VerticalCheckboxGroupItem, 'options'>;

function createItem( labelStringProperty: TReadOnlyProperty<string>,
                     property: Property<boolean>, providedOptions: ItemOptions ): VerticalCheckboxGroupItem {

  return {
    createNode: tandem => {
      const labelText = new Text( labelStringProperty, {
        font: GOConstants.CONTROL_FONT,
        maxWidth: 90,
        tandem: tandem.createTandem( 'labelText' )
      } );

      // Create HBox if icon is present, otherwise the label is just text.
      return providedOptions.iconNode ?
             new HBox( { children: [ labelText, providedOptions.iconNode ], spacing: 8 } ) :
             labelText;
    },
    property: property,
    options: providedOptions.options,
    tandemName: providedOptions.tandemName
  };
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );