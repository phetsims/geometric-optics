// Copyright 2021, University of Colorado Boulder

/**
 * Main control panel for the optical element properties, visibility checkboxes  and the light rays mode
 * Appears at the bottom of the simulation
 *
 * @author Martin Veillette
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRayMode from '../model/LightRayMode.js';

const metersPattern = geometricOpticsStrings.metersPattern;
const noneString = geometricOpticsStrings.none;
const manyString = geometricOpticsStrings.many;
const marginalString = geometricOpticsStrings.marginal;
const principalString = geometricOpticsStrings.principal;
const curvatureRadiusString = geometricOpticsStrings.curvatureRadius;
const diameterString = geometricOpticsStrings.diameter;
const refractiveIndexString = geometricOpticsStrings.refractiveIndex;
const focalPointString = geometricOpticsStrings.focalPoint;
const virtualImageString = geometricOpticsStrings.virtualImage;
const movablePointString = geometricOpticsStrings.movablePoint;
const guidesString = geometricOpticsStrings.guides;
const labelsString = geometricOpticsStrings.labels;
const rayModeTitleString = geometricOpticsStrings.rayModeTitle;

const CONTROL_PANEL_FONT = GeometricOpticsConstants.CONTROL_PANEL_FONT;
const TITLE_FONT = GeometricOpticsConstants.TITLE_FONT;

class GeometricOpticsControlPanel extends Panel {

  /**
   * @param {Optic} optic
   * @param {EnumerationProperty.<LightRayMode>} lightRayModeProperty
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} config
   */
  constructor( optic, lightRayModeProperty, visibleProperties, modelViewTransform, tandem, config ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    config = merge( {
      hasLens: false
    }, config );

    // items for ray Mode radio buttons
    const rayModeRadioButtonGroupItems = [
      { value: LightRayMode.MARGINAL_RAYS, node: new Text( marginalString, { font: CONTROL_PANEL_FONT, maxWidth: 100 } ) },
      { value: LightRayMode.PRINCIPAL_RAYS, node: new Text( principalString, { font: CONTROL_PANEL_FONT, maxWidth: 100 } ) },
      { value: LightRayMode.MANY_RAYS, node: new Text( manyString, { font: CONTROL_PANEL_FONT, maxWidth: 100 } ) },
      { value: LightRayMode.NO_RAYS, node: new Text( noneString, { font: CONTROL_PANEL_FONT, maxWidth: 100 } ) }
    ];

    const commonNumberControlOptions =
      {
        layoutFunction: NumberControl.createLayoutFunction3( { ySpacing: 12 } ),

        titleNodeOptions: {
          font: CONTROL_PANEL_FONT,
          maxWidth: 160
        },
        sliderOptions: {
          trackSize: new Dimension2( 120, 4 ),
          thumbSize: new Dimension2( 10, 20 )
        },
        numberDisplayOptions: { maxWidth: 100 }
      };

    // options for number controls that have length units
    const lengthNumberControlOptions = merge( commonNumberControlOptions,
      {
        delta: 0.1,
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.METER_DECIMAL_PLACES,
          valuePattern: StringUtils.fillIn( metersPattern, {
            meters: SunConstants.VALUE_NAMED_PLACEHOLDER
          } )
        }
      } );

    // create number control for the radius of curvature of optical element
    const curvatureRadiusControl = new NumberControl(
      curvatureRadiusString,
      optic.radiusOfCurvatureProperty,
      optic.radiusOfCurvatureProperty.range,
      lengthNumberControlOptions );

    // create number control for the diameter of optical element
    const diameterControl = new NumberControl(
      diameterString,
      optic.diameterProperty,
      optic.diameterProperty.range,
      lengthNumberControlOptions );

    // array of number controls
    let controls;

    if ( config.hasLens ) {

      // options for index of refraction control
      const indexOfRefractionNumberControlOptions = merge( commonNumberControlOptions,
        {
          delta: 0.01,
          numberDisplayOptions: {
            decimalPlaces: GeometricOpticsConstants.INDEX_DECIMAL_PLACES
          }
        } );


      // create number control for the index of refraction of lens
      const indexOfRefractionControl = new NumberControl(
        refractiveIndexString,
        optic.indexOfRefractionProperty,
        optic.indexOfRefractionProperty.range,
        indexOfRefractionNumberControlOptions );

      // add three number controls
      controls = [ curvatureRadiusControl,
        indexOfRefractionControl,
        diameterControl ];
    }
    else {
      // if not a lens, add two number controls
      controls = [ curvatureRadiusControl,
        diameterControl ];
    }

    // create title for radio button group for light ray mode
    const rayModeTitle = new Text( rayModeTitleString, { font: TITLE_FONT, maxWidth: 100 } );

    // create button radio group for the light ray mode
    const rayModeRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      lightRayModeProperty,
      rayModeRadioButtonGroupItems, {
        spacing: 4,
        align: 'left',
        radioButtonOptions: {
          radius: 7
        },
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
     * @returns {{node: Text, tandem: Tandem, property}}
     */
    const createCheckboxGroupItem = ( string, property ) => {
      return {
        node: new Text( string, { font: CONTROL_PANEL_FONT, maxWidth: 100 } ),
        property: property,
        tandem: tandem
      };
    };
    // create checkbox group for visibility settings
    const checkboxGroupItems = [
      createCheckboxGroupItem( focalPointString, visibleProperties.visibleFocalPointProperty ),
      createCheckboxGroupItem( labelsString, visibleProperties.visibleLabelsProperty ),
      createCheckboxGroupItem( virtualImageString, visibleProperties.visibleVirtualImageProperty ),
      createCheckboxGroupItem( movablePointString, visibleProperties.visibleMovablePointProperty ),
      createCheckboxGroupItem( guidesString, visibleProperties.visibleGuidesProperty )
    ];

    // if using mirror, remove guides checkbox
    if ( !config.hasLens ) {
      checkboxGroupItems.pop();
    }

    // create check box group
    const checkboxGroup = new VerticalCheckboxGroup( checkboxGroupItems, { spacing: 4, checkboxOptions: { boxWidth: 14 } } );

    // length of vertical line should be the height of the tallest control panel element
    const verticalSeparatorLength = Math.max( checkboxGroup.height, rayModesBox.height );

    // create vertical lines to separate control panel elements
    const leftSeparator = new Line( 0, 0, 0, verticalSeparatorLength, { stroke: 'gray', lineWidth: 1 } );
    const rightSeparator = new Line( 0, 0, 0, verticalSeparatorLength, { stroke: 'gray', lineWidth: 1 } );

    // add all elements of the panel in a horizontal HBox
    const content = new AlignBox( new HBox( {
      spacing: 20,
      align: 'center',
      children: [ rayModesBox,
        leftSeparator, ...controls, rightSeparator,
        checkboxGroup ]
    } ), {
      xAlign: 'left'
    } );

    super( content, { xMargin: 15, yMargin: 10, fill: 'rgb(240,240,240)' } );

  }
}

geometricOptics.register( 'GeometricOpticsControlPanel', GeometricOpticsControlPanel );
export default GeometricOpticsControlPanel;
