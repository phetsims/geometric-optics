// Copyright 2021-2022, University of Colorado Boulder

/**
 * VisibilityCheckboxGroup is a group of checkboxes for controlling visibility of things in the user interface.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GuideNode from './GuideNode.js';
import GOConstants from '../GOConstants.js';
import GOQueryParameters from '../GOQueryParameters.js';
import FocalPointNode from './FocalPointNode.js';
import SecondPointNode from './SecondPointNode.js';
import VisibleProperties from './VisibleProperties.js';
import TwoFPointNode from './TwoFPointNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type VisibilityCheckboxGroupOptions = {
  isBasicsVersion: boolean,
  isMirrorScreen: boolean,
  tandem: Tandem
};

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

    const options = merge( {
      spacing: 4,
      checkboxOptions: { boxWidth: 14 }
    }, providedOptions );

    const items = [

      // Focal Points (F)
      {
        node: createLabel( geometricOpticsStrings.focalPoints, FocalPointNode.createIcon() ),
        property: visibleProperties.focalPointsVisibleProperty,
        options: {
          visible: !( options.isBasicsVersion && options.isMirrorScreen )
        },
        tandem: options.tandem.createTandem( 'focalPointsCheckbox' )
      },

      // 2F Points
      {
        node: createLabel( geometricOpticsStrings.twoFPoints, TwoFPointNode.createIcon() ),
        property: visibleProperties.twoFPointsVisibleProperty,
        options: {
          visible: GOQueryParameters.enable2F && !( options.isBasicsVersion && options.isMirrorScreen )
        },
        tandem: options.tandem.createTandem( 'twoFPointsCheckbox' )
      },

      // Virtual Image
      {
        node: createLabel( geometricOpticsStrings.virtualImage ),
        property: visibleProperties.virtualImageVisibleProperty,
        options: {
          enabledProperty: virtualImageCheckboxEnabledProperty
        },
        tandem: options.tandem.createTandem( 'virtualImageCheckbox' )
      },

      // Labels
      {
        node: createLabel( geometricOpticsStrings.labels ),
        property: visibleProperties.labelsVisibleProperty,
        tandem: options.tandem.createTandem( 'labelsCheckbox' )
      },

      // Second Point
      {
        node: createLabel( geometricOpticsStrings.secondPoint, SecondPointNode.createIcon() ),
        property: visibleProperties.secondPointVisibleProperty,
        options: {
          visible: !options.isBasicsVersion
        },
        tandem: options.tandem.createTandem( 'secondPointCheckbox' )
      }
    ];

    // Guides
    if ( isLens ) {
      items.push( {
        node: createLabel( geometricOpticsStrings.guides, GuideNode.createIcon() ),
        property: visibleProperties.guidesVisibleProperty,
        options: {
          visible: GOQueryParameters.enableGuides
        } as any, //TODO should be of type CheckboxOptions
        tandem: options.tandem.createTandem( 'guidesCheckbox' )
      } );
    }

    super( items, options );
  }
}

/**
 * Create a label for a checkbox, with optional icon.
 * @param string
 * @param iconNode
 */
function createLabel( string: string, iconNode?: Node ): Node {

  const textNode = new Text( string, {
    font: GOConstants.CONTROL_FONT,
    maxWidth: 100
  } );

  // Create HBox if icon is present, otherwise the label is just text.
  return iconNode ? new HBox( { children: [ textNode, iconNode ], spacing: 8 } ) : textNode;
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );
export default VisibilityCheckboxGroup;