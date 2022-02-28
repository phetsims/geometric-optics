// Copyright 2021-2022, University of Colorado Boulder

/**
 * VisibilityCheckboxGroup is a group of checkboxes for controlling visibility of things in the user interface.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
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
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  isBasicsVersion: boolean,
  isMirrorScreen: boolean
};

type VisibilityCheckboxGroupOptions = SelfOptions & PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

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
      spacing: 4,
      checkboxOptions: { boxWidth: 14 }
    }, providedOptions );

    const focalPointsCheckboxTandem = options.tandem.createTandem( 'focalPointsCheckbox' );
    const twoFPointsCheckboxTandem = options.tandem.createTandem( 'twoFPointsCheckbox' );
    const virtualImageCheckboxTandem = options.tandem.createTandem( 'virtualImageCheckbox' );
    const labelsCheckboxTandem = options.tandem.createTandem( 'labelsCheckbox' );
    const seconPointCheckboxTandem = options.tandem.createTandem( 'secondPointCheckbox' );

    const items = [

      // Focal Points (F)
      {
        node: createLabel( geometricOpticsStrings.focalPoints, focalPointsCheckboxTandem, FocalPointNode.createIcon() ),
        property: visibleProperties.focalPointsVisibleProperty,
        options: {
          visible: !( options.isBasicsVersion && options.isMirrorScreen )
        },
        tandem: focalPointsCheckboxTandem
      },

      // 2F Points
      {
        node: createLabel( geometricOpticsStrings.twoFPoints, twoFPointsCheckboxTandem, TwoFPointNode.createIcon() ),
        property: visibleProperties.twoFPointsVisibleProperty,
        options: {
          visible: GOQueryParameters.enable2F && !( options.isBasicsVersion && options.isMirrorScreen )
        },
        tandem: twoFPointsCheckboxTandem
      },

      // Virtual Image
      {
        node: createLabel( geometricOpticsStrings.virtualImage, virtualImageCheckboxTandem ),
        property: visibleProperties.virtualImageVisibleProperty,
        options: {
          enabledProperty: virtualImageCheckboxEnabledProperty
        },
        tandem: virtualImageCheckboxTandem
      },

      // Labels
      {
        node: createLabel( geometricOpticsStrings.labels, labelsCheckboxTandem ),
        property: visibleProperties.labelsVisibleProperty,
        tandem: labelsCheckboxTandem
      },

      // Second Point
      {
        node: createLabel( geometricOpticsStrings.secondPoint, seconPointCheckboxTandem, SecondPointNode.createIcon() ),
        property: visibleProperties.secondPointVisibleProperty,
        options: {
          visible: !options.isBasicsVersion
        },
        tandem: seconPointCheckboxTandem
      }
    ];

    // Guides
    if ( isLens ) {
      const guidesCheckboxTandem = options.tandem.createTandem( 'guidesCheckbox' );
      items.push( {
        node: createLabel( geometricOpticsStrings.guides, guidesCheckboxTandem, GuideNode.createIcon() ),
        property: visibleProperties.guidesVisibleProperty,
        options: {
          visible: GOQueryParameters.enableGuides
        },
        tandem: guidesCheckboxTandem
      } );
    }

    super( items, options );
  }
}

/**
 * Create a label for a checkbox, with optional icon.
 * @param string
 * @param checkboxTandem
 * @param iconNode
 */
function createLabel( string: string, checkboxTandem: Tandem, iconNode?: Node ): Node {

  const textNode = new Text( string, {
    font: GOConstants.CONTROL_FONT,
    maxWidth: 100,
    tandem: checkboxTandem.createTandem( 'textNode' ),
    phetioVisiblePropertyInstrumented: false
  } );

  // Create HBox if icon is present, otherwise the label is just text.
  return iconNode ? new HBox( { children: [ textNode, iconNode ], spacing: 8 } ) : textNode;
}

geometricOptics.register( 'VisibilityCheckboxGroup', VisibilityCheckboxGroup );
export default VisibilityCheckboxGroup;