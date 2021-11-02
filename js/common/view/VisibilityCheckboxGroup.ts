// Copyright 2021, University of Colorado Boulder

/**
 * VisibilityCheckboxGroup is a group of checkboxes for controlling visibility of things in the user interface.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GuideNode from '../../lens/view/GuideNode.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import OpticTypeEnum from '../model/OpticTypeEnum.js';
import FocalPointNode from './FocalPointNode.js';
import SecondPointNode from './SecondPointNode.js';
import VisibleProperties from './VisibleProperties.js';

class VisibilityCheckboxGroup extends VerticalCheckboxGroup {

  /**
   * @param {VisibleProperties} visibleProperties
   * @param {OpticTypeEnum} opticType
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Object} [options]
   */
  constructor( visibleProperties: VisibleProperties, opticType: OpticTypeEnum,
               representationProperty: any, options?: any ) {  //TODO any any

    assert && assert( representationProperty instanceof EnumerationProperty );

    options = merge( {
      spacing: 4,
      checkboxOptions: { boxWidth: 14 },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const items = [

      // Focal Points
      {
        node: createLabel( geometricOpticsStrings.focalPoints, FocalPointNode.createIcon( { stroke: 'black' } ) ),
        property: visibleProperties.focalPointsVisibleProperty,
        tandem: options.tandem.createTandem( 'focalPointsCheckbox' )
      },

      // Virtual Image
      {
        node: createLabel( geometricOpticsStrings.virtualImage ),
        property: visibleProperties.virtualImageVisibleProperty,
        options: {

          // Disable the 'Virtual Image' checkbox for light source, see https://github.com/phetsims/geometric-optics/issues/216
          // @ts-ignore TODO parameter 'representation' implicitly has type 'any'
          enabledProperty: new DerivedProperty( [ representationProperty ], representation => representation.isObject )
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
    if ( opticType === 'lens' ) {
      items.push( {
        node: createLabel( geometricOpticsStrings.guides, GuideNode.createIcon() ),
        property: visibleProperties.guidesVisibleProperty,
        options: {
          // @ts-ignore TODO
          visible: GeometricOpticsQueryParameters.showGuides
        },
        tandem: options.tandem.createTandem( 'guidesCheckbox' )
      } );
    }

    super( items, options );
  }
}

/**
 * Create a label for a checkbox, with optional icon.
 * @param {string} string
 * @param {Node} [iconNode]
 * @returns {Node}
 */
function createLabel( string: string, iconNode?: Node ) {

  const textNode = new Text( string, {
    font: GeometricOpticsConstants.CONTROL_FONT,
    maxWidth: 100
  } );

  // Create HBox if icon is present, otherwise the label is just text.
  return iconNode ? new HBox( { children: [ textNode, iconNode ], spacing: 8 } ) : textNode;
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );
export default VisibilityCheckboxGroup;