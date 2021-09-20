// Copyright 2021, University of Colorado Boulder

/**
 * Main control panel for the optical element properties, visibility checkboxes  and the light rays mode
 * Appears at the bottom of the simulation
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import Optic from '../model/Optic.js';
import FocalPointNode from './FocalPointNode.js';
import RayModeRadioButtonGroup from './RayModeRadioButtonGroup.js';
import SecondSourceNode from './SecondSourceNode.js';
import VisibleProperties from './VisibleProperties.js';

// constants
const NUMBER_CONTROL_OPTIONS = {
  layoutFunction: NumberControl.createLayoutFunction3( { ySpacing: 12 } ),
  titleNodeOptions: {
    font: GeometricOpticsConstants.CONTROL_FONT,
    maxWidth: 160
  },
  sliderOptions: {
    trackSize: new Dimension2( 120, 4 ),
    thumbSize: new Dimension2( 10, 20 )
  },
  numberDisplayOptions: {
    maxWidth: 100
  }
};

class GeometricOpticsControlPanel extends Panel {

  /**
   * @param {Optic} optic
   * @param {EnumerationProperty.<LightRayMode>} lightRayModeProperty
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic, lightRayModeProperty, visibleProperties, modelViewTransform, options ) {

    assert && assert( optic instanceof Optic );
    assert && assert( lightRayModeProperty instanceof EnumerationProperty );
    assert && assert( visibleProperties instanceof VisibleProperties );
    assert && assert( modelViewTransform instanceof ModelViewTransform2 );

    options = merge( {

      // Panel options
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb( 240, 240, 240 )'
    }, options );

    // Rays radio buttons ---------------------------------------------------------------------------------------

    // create title for radio button group for light ray mode
    const rayModeTitle = new Text( geometricOpticsStrings.rayModeTitle, {
      font: GeometricOpticsConstants.TITLE_FONT,
      maxWidth: 100
    } );

    // create button radio group for the light ray mode
    const rayModeRadioButtonGroup = new RayModeRadioButtonGroup( lightRayModeProperty );

    // create vertical box for ray modes
    const rayModesBox = new VBox( {
      children: [ rayModeTitle, rayModeRadioButtonGroup ],
      align: 'left',
      spacing: 4
    } );

    // Lens/Mirror controls ---------------------------------------------------------------------------------------

    const numberControls = [];

    // create number control for the radius of curvature of optical element
    const curvatureRadiusControl = new NumberControl(
      geometricOpticsStrings.curvatureRadius,
      optic.radiusOfCurvatureProperty,
      optic.radiusOfCurvatureProperty.range,
      merge( {}, NUMBER_CONTROL_OPTIONS, {
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.CURVATURE_RADIUS_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } ) );
    numberControls.push( curvatureRadiusControl );

    if ( optic.type === Optic.Type.LENS ) {
      const refractiveIndexControl = new NumberControl(
        geometricOpticsStrings.refractiveIndex,
        optic.indexOfRefractionProperty,
        optic.indexOfRefractionProperty.range,
        merge( {}, NUMBER_CONTROL_OPTIONS, {
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: GeometricOpticsConstants.REFRACTIVE_INDEX_DECIMAL_PLACES
          }
        } ) );
      numberControls.push( refractiveIndexControl );
    }

    // create number control for the diameter of optical element
    const diameterControl = new NumberControl(
      geometricOpticsStrings.diameter,
      optic.diameterProperty,
      optic.diameterProperty.range,
      merge( {}, NUMBER_CONTROL_OPTIONS, {
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.DIAMETER_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } ) );
    numberControls.push( diameterControl );

    // Visibility checkboxes ---------------------------------------------------------------------------------------

    /**
     * create a checkbox Group item
     * @param {string} string
     * @param {Property} property
     * @param {Object} [options]
     * @returns {{node: Node, property: Property }} item
     */
    const createCheckboxGroupItem = ( string, property, options ) => {
      options = merge( {
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
        property: property
      };
    };

    // create focal point icon
    const focalPointIcon = FocalPointNode.createIcon( { stroke: 'black' } );

    // create second source point icon
    const secondSourcePointIcon = SecondSourceNode.createIcon();

    // create checkbox group for visibility settings
    const checkboxGroupItems = [
      createCheckboxGroupItem( geometricOpticsStrings.focalPoint, visibleProperties.focalPointVisibleProperty,
        { icon: focalPointIcon } ),
      createCheckboxGroupItem( geometricOpticsStrings.virtualImage, visibleProperties.virtualImageVisibleProperty ),
      createCheckboxGroupItem( geometricOpticsStrings.labels, visibleProperties.labelsVisibleProperty ),
      createCheckboxGroupItem( geometricOpticsStrings.secondSource, visibleProperties.secondSourceVisibleProperty,
        { icon: secondSourcePointIcon } ),
      createCheckboxGroupItem( geometricOpticsStrings.guides, visibleProperties.guidesVisibleProperty )
    ];

    //TODO this will be problematic for PhET-iO, better to not create it if it's not needed.
    // remove guides checkbox for mirror  or because of query parameters
    if ( !options.hasLens || GeometricOpticsQueryParameters.showGuides === false ) {
      checkboxGroupItems.pop();

      // ensure that the guides are invisible as well
      visibleProperties.guidesVisibleProperty.value = false;
    }

    // create check box group
    const checkboxGroup = new VerticalCheckboxGroup( checkboxGroupItems, {
      spacing: 4,
      checkboxOptions: { boxWidth: 14 }
    } );

    // length of vertical line should be the height of the tallest control panel element
    const verticalSeparatorLength = Math.max( checkboxGroup.height, rayModesBox.height );

    // create vertical lines to separate control panel elements
    const lineOptions = { stroke: 'gray', lineWidth: 1 };
    const leftSeparator = new Line( 0, 0, 0, verticalSeparatorLength, lineOptions );
    const rightSeparator = new Line( 0, 0, 0, verticalSeparatorLength, lineOptions );

    // add all elements of the panel in a horizontal HBox
    const content = new AlignBox( new HBox( {
        children: [ rayModesBox,
          leftSeparator,
          ...numberControls,
          rightSeparator,
          checkboxGroup ],
        spacing: 20,
        align: 'center'
      } ),
      { xAlign: 'left' }
    );

    super( content, options );
  }
}

geometricOptics.register( 'GeometricOpticsControlPanel', GeometricOpticsControlPanel );
export default GeometricOpticsControlPanel;