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
import Property from '../../../../axon/js/Property.js';
import SecondPointNode from './SecondPointNode.js';
import FocalPointNode from './FocalPointNode.js';
import TwoFPointNode from './TwoFPointNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GOGlobalOptions from '../GOGlobalOptions.js';

type SelfOptions = {
  isBasicsVersion: boolean;
  isMirrorScreen: boolean;
};

export type VisibilityCheckboxGroupOptions = SelfOptions & PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

class VisibilityCheckboxGroup extends VerticalCheckboxGroup {

  /**
   * @param isLens
   * @param visibleProperties
   * @param virtualImageCheckboxEnabledProperty
   * @param providedOptions
   */
  constructor( isLens: boolean,
               visibleProperties: VisibleProperties,
               virtualImageCheckboxEnabledProperty: IReadOnlyProperty<boolean>,
               providedOptions: VisibilityCheckboxGroupOptions ) {

    const options = optionize<VisibilityCheckboxGroupOptions, {}, VerticalCheckboxGroupOptions>( {

      // VerticalCheckboxGroupOptions
      spacing: 4,
      checkboxOptions: {
        boxWidth: GOConstants.CHECKBOX_BOX_WIDTH
      }
    }, providedOptions );

    const items = [

      // Focal Points (F)
      createItem( geometricOpticsStrings.checkbox.focalPoints, visibleProperties.focalPointsVisibleProperty, {
        iconNode: FocalPointNode.createIcon(),
        options: {
          visible: !( options.isBasicsVersion && options.isMirrorScreen )
        },
        tandem: options.tandem.createTandem( 'focalPointsCheckbox' )
      } ),

      // 2F Points
      createItem( geometricOpticsStrings.checkbox.twoFPoints, visibleProperties.twoFPointsVisibleProperty, {
        iconNode: TwoFPointNode.createIcon(),
        options: {
          visibleProperty: new DerivedProperty( [ GOGlobalOptions.enable2FProperty ],
            ( enable2F: boolean ) => ( enable2F && !( options.isBasicsVersion && options.isMirrorScreen ) ) )
        },
        tandem: options.tandem.createTandem( 'twoFPointsCheckbox' )
      } ),

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
    if ( isLens ) {
      items.push( createItem( geometricOpticsStrings.checkbox.guides, visibleProperties.guidesVisibleProperty, {
        iconNode: GuideNode.createIcon(),
        options: {
          visibleProperty: GOGlobalOptions.guidesEnabledProperty
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

function createItem( string: string, property: Property<boolean>, providedOptions: ItemOptions ): VerticalCheckboxGroupItem {

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
export default VisibilityCheckboxGroup;