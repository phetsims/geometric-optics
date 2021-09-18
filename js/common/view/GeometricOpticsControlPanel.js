// Copyright 2021, University of Colorado Boulder

/**
 * Main control panel for the optical element properties, visibility checkboxes  and the light rays mode
 * Appears at the bottom of the simulation
 *
 * @author Martin Veillette
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import GeometricOpticsQueryParameters from '../GeometricOpticsQueryParameters.js';
import LightRayMode from '../model/LightRayMode.js';
import FocalPointNode from './FocalPointNode.js';
import SecondSourceNode from './SecondSourceNode.js';

class GeometricOpticsControlPanel extends Panel {

  /**
   * @param {Optic} optic
   * @param {Property.<LightRayMode>} lightRayModeProperty
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( optic, lightRayModeProperty, visibleProperties, modelViewTransform, options ) {

    options = merge( {
      hasLens: false
    }, options );

    /**
     * create an item for the Radio Button Group
     * @param {LightRayMode} mode
     * @param {string} string
     * @returns {{node: Text, value: LightRayMode}} item
     */
    const createRayModeRadioButtonGroupItem = ( mode, string ) => {
      return {
        value: mode,
        node: new Text( string, {
          font: GeometricOpticsConstants.CONTROL_FONT,
          maxWidth: 100
        } )
      };
    };

    // items for ray Mode radio buttons
    const rayModeRadioButtonGroupItems = [
      createRayModeRadioButtonGroupItem( LightRayMode.MARGINAL, geometricOpticsStrings.marginal ),
      createRayModeRadioButtonGroupItem( LightRayMode.PRINCIPAL, geometricOpticsStrings.principal ),
      createRayModeRadioButtonGroupItem( LightRayMode.MANY, geometricOpticsStrings.many ),
      createRayModeRadioButtonGroupItem( LightRayMode.NONE, geometricOpticsStrings.none )
    ];

    // options common to all number controls
    const commonNumberControlOptions = {
      layoutFunction: NumberControl.createLayoutFunction3( { ySpacing: 12 } ),
      titleNodeOptions: {
        font: GeometricOpticsConstants.CONTROL_FONT,
        maxWidth: 160
      },
      sliderOptions: {
        trackSize: new Dimension2( 120, 4 ),
        thumbSize: new Dimension2( 10, 20 )
      },
      numberDisplayOptions: { maxWidth: 100 }
    };

    // create number control for the radius of curvature of optical element
    const curvatureRadiusControl = new NumberControl(
      geometricOpticsStrings.curvatureRadius,
      optic.radiusOfCurvatureProperty,
      optic.radiusOfCurvatureProperty.range,
      merge( {}, commonNumberControlOptions, {
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.CURVATURE_RADIUS_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } ) );

    // create number control for the diameter of optical element
    const diameterControl = new NumberControl(
      geometricOpticsStrings.diameter,
      optic.diameterProperty,
      optic.diameterProperty.range,
      merge( {}, commonNumberControlOptions, {
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.DIAMETER_DECIMAL_PLACES,
          valuePattern: geometricOpticsStrings.valueCentimetersPattern
        }
      } ) );

    // array of number controls
    let controls;

    if ( options.hasLens ) {

      // create number control for the index of refraction of lens
      const refractiveIndexControl = new NumberControl(
        geometricOpticsStrings.refractiveIndex,
        optic.indexOfRefractionProperty,
        optic.indexOfRefractionProperty.range,
        merge( {}, commonNumberControlOptions, {
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: GeometricOpticsConstants.REFRACTIVE_INDEX_DECIMAL_PLACES
          }
        } ) );

      // add three number controls
      controls = [ curvatureRadiusControl, refractiveIndexControl, diameterControl ];
    }
    else {

      // only lens has an index of refraction, add curvature and diameter controls
      controls = [ curvatureRadiusControl, diameterControl ];
    }

    // create title for radio button group for light ray mode
    const rayModeTitle = new Text( geometricOpticsStrings.rayModeTitle, {
      font: GeometricOpticsConstants.TITLE_FONT,
      maxWidth: 100
    } );

    // create button radio group for the light ray mode
    const rayModeRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      lightRayModeProperty,
      rayModeRadioButtonGroupItems, {
        spacing: 4,
        align: 'left',
        radioButtonOptions: { radius: 7 },
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10
      } );

    // create vertical box for ray modes
    const rayModesBox = new VBox( {
      children: [ rayModeTitle, rayModeRadioButtonGroup ],
      align: 'left',
      spacing: 4
    } );

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

      // create hBox if icon is present, otherwise merely attach text
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
          ...controls,
          rightSeparator,
          checkboxGroup ],
        spacing: 20,
        align: 'center'
      } ),
      { xAlign: 'left' } );

    // create and add panel
    super( content, { xMargin: 15, yMargin: 10, fill: 'rgb(240,240,240)' } );

  }
}

geometricOptics.register( 'GeometricOpticsControlPanel', GeometricOpticsControlPanel );
export default GeometricOpticsControlPanel;