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
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import Optic from '../model/Optic.js';
import FocalPointNode from './FocalPointNode.js';
import SecondSourceNode from './SecondSourceNode.js';
import VisibleProperties from './VisibleProperties.js';

class VisibilityCheckboxGroup extends VerticalCheckboxGroup {

  /**
   * @param {VisibleProperties} visibleProperties
   * @param {Optic.Type} opticType
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Object} [options]
   */
  constructor( visibleProperties, opticType, representationProperty, options ) {

    assert && assert( visibleProperties instanceof VisibleProperties );
    assert && assert( Optic.Type.includes( opticType ) );
    assert && assert( representationProperty instanceof EnumerationProperty );

    options = merge( {
      spacing: 4,
      checkboxOptions: { boxWidth: 14 }
    }, options );

    const items = [

      // Focal Point
      {
        node: createLabel( geometricOpticsStrings.focalPoint, FocalPointNode.createIcon( { stroke: 'black' } ) ),
        property: visibleProperties.focalPointVisibleProperty
      },

      // Virtual Image
      {
        node: createLabel( geometricOpticsStrings.virtualImage ),
        property: visibleProperties.virtualImageVisibleProperty,
        options: {

          // Disable the 'Virtual Image' checkbox for light source, see https://github.com/phetsims/geometric-optics/issues/216
          enabledProperty: new DerivedProperty( [ representationProperty ],
            representation => !!representation.isObject )
        }
      },

      // Labels
      {
        node: createLabel( geometricOpticsStrings.labels ),
        property: visibleProperties.labelsVisibleProperty
      },

      // Second Point
      {
        node: createLabel( geometricOpticsStrings.secondSource, SecondSourceNode.createIcon() ),
        property: visibleProperties.secondSourceVisibleProperty
      }
    ];

    // Guides - add Guides checkbox for lens, unless excluded via query parameter
    if ( ( opticType === Optic.Type.LENS ) && GeometricOpticsQueryParameters.showGuides ) {
      items.push( {
        node: createLabel( geometricOpticsStrings.guides ),
        property: visibleProperties.guidesVisibleProperty
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
function createLabel( string, iconNode ) {

  const textNode = new Text( string, {
    font: GeometricOpticsConstants.CONTROL_FONT,
    maxWidth: 100
  } );

  // create HBox if icon is present, otherwise merely attach text
  return iconNode ? new HBox( { children: [ textNode, iconNode ], spacing: 8 } ) : textNode;
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );
export default VisibilityCheckboxGroup;