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
      createItem( geometricOpticsStrings.focalPoint, visibleProperties.focalPointVisibleProperty, {
        icon: FocalPointNode.createIcon( { stroke: 'black' } )
      } ),
      createItem( geometricOpticsStrings.virtualImage, visibleProperties.virtualImageVisibleProperty, {

        // Disable the 'Virtual Image' checkbox for light source, see https://github.com/phetsims/geometric-optics/issues/216
        checkboxOptions: {
          enabledProperty: new DerivedProperty( [ representationProperty ],
            representation => !!representation.isObject )
        }
      } ),
      createItem( geometricOpticsStrings.labels, visibleProperties.labelsVisibleProperty ),
      createItem( geometricOpticsStrings.secondSource, visibleProperties.secondSourceVisibleProperty, {
        icon: SecondSourceNode.createIcon()
      } )
    ];

    // Add Guides checkbox for lens, unless excluded via query parameter.
    if ( ( opticType === Optic.Type.LENS ) && GeometricOpticsQueryParameters.showGuides ) {
      items.push( createItem( geometricOpticsStrings.guides, visibleProperties.guidesVisibleProperty ) );
    }

    super( items, options );
  }
}

/**
 * Create an item for the checkbox group.
 * @param {string} string
 * @param {Property} property
 * @param {Object} [options]
 * @returns {{node: Node, property: Property }}
 */
function createItem( string, property, options ) {

  options = merge( {
    checkboxOptions: null, // passed to Checkbox by VerticalCheckboxGroup
    icon: null // {null|Node}
  }, options );

  // text for the checkbox
  const text = new Text( string, {
    font: GeometricOpticsConstants.CONTROL_FONT,
    maxWidth: 100
  } );

  // create HBox if icon is present, otherwise merely attach text
  const node = ( options.icon ) ? new HBox( { children: [ text, options.icon ], spacing: 8 } ) : text;

  return {
    node: node,
    property: property,
    options: options.checkboxOptions
  };
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );
export default VisibilityCheckboxGroup;