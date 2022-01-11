// Copyright 2021, University of Colorado Boulder

/**
 * VisibilityCheckboxGroup is a group of checkboxes for controlling visibility of things in the user interface.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GuideNode from '../../lens/view/GuideNode.js';
import GOConstants from '../GOConstants.js';
import GOQueryParameters from '../GOQueryParameters.js';
import FocalPointNode from './FocalPointNode.js';
import SecondPointNode from './SecondPointNode.js';
import VisibleProperties from './VisibleProperties.js';
import Representation from '../model/Representation.js';
import TwoFPointNode from './TwoFPointNode.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type Options = {
  tandem: Tandem
};

class VisibilityCheckboxGroup extends VerticalCheckboxGroup {

  /**
   * @param visibleProperties
   * @param isLens
   * @param representationProperty
   * @param providedOptions
   */
  constructor( visibleProperties: VisibleProperties, isLens: boolean,
               representationProperty: IReadOnlyProperty<Representation>, providedOptions: Options ) {

    const options = merge( {
      spacing: 4,
      checkboxOptions: { boxWidth: 14 }
    }, providedOptions ) as Options;

    const items = [

      // Focal Points (F)
      {
        node: createLabel( geometricOpticsStrings.focalPoints, FocalPointNode.createIcon() ),
        property: visibleProperties.focalPointsVisibleProperty,
        tandem: options.tandem.createTandem( 'focalPointsCheckbox' )
      },

      // 2F Points
      {
        node: createLabel( geometricOpticsStrings.twoFPoints, TwoFPointNode.createIcon() ),
        property: visibleProperties.twoFPointsVisibleProperty,
        options: {
          visible: GOQueryParameters.enable2F
        },
        tandem: options.tandem.createTandem( 'twoFPointsCheckbox' )
      },

      // Virtual Image
      {
        node: createLabel( geometricOpticsStrings.virtualImage ),
        property: visibleProperties.virtualImageVisibleProperty,
        options: {

          // Disable the 'Virtual Image' checkbox for light source, see https://github.com/phetsims/geometric-optics/issues/216
          enabledProperty: new DerivedProperty( [ representationProperty ],
            ( representation: Representation ) => representation.isObject )
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
        } as any, // TS any - options are passed to Checkbox constructor, should be of type CheckboxOptions
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