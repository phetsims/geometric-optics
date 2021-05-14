// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRays from '../model/LightRays.js';
import OpticalElement from '../model/OpticalElement.js';

const metersPattern = geometricOpticsStrings.metersPattern;
const noneString = geometricOpticsStrings.none;
const manyString = geometricOpticsStrings.many;
const marginalString = geometricOpticsStrings.marginal;
const principalString = geometricOpticsStrings.principal;
const curvatureRadiusString = geometricOpticsStrings.curvatureRadius;
const diameterString = geometricOpticsStrings.diameter;
const refractiveIndexString = geometricOpticsStrings.refractiveIndex;
const concaveString = geometricOpticsStrings.concave;
const convexString = geometricOpticsStrings.convex;
const focalPointString = geometricOpticsStrings.focalPoint;
const rulersString = geometricOpticsStrings.rulers;
const virtualImageString = geometricOpticsStrings.virtualImage;
const movablePointString = geometricOpticsStrings.movablePoint;
const guidesString = geometricOpticsStrings.guides;

class ControlPanel extends Panel {

  /**
   * @param {OpticalElement} opticalElement
   * @param {LightRays} lightRays
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( opticalElement, lightRays, visibleProperties, modelViewTransform, tandem, options ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const Mode = LightRays.Mode;
    const rayModeRadioButtonGroupItems = [
      {
        value: Mode.MARGINAL_RAYS,
        node: new Text( marginalString )
      },
      {
        value: Mode.PRINCIPAL_RAYS,
        node: new Text( principalString )
      },
      {
        value: Mode.MANY_RAYS,
        node: new Text( manyString )
      },
      {
        value: Mode.NO_RAYS,
        node: new Text( noneString )
      }
    ];

    const Curve = OpticalElement.Curve;
    const curvatureTypesRadioButtonGroupItems = [
      {
        value: Curve.CONCAVE,
        node: new Text( concaveString )
      },
      {
        value: Curve.CONVEX,
        node: new Text( convexString )
      }
    ];


    const indexOfRefractionNumberControlOptions =
      {
        delta: 0.01,
        layoutFunction: NumberControl.createLayoutFunction3(),
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.INDEX_DECIMAL_PLACES
        },
        sliderOptions: {
          trackSize: new Dimension2( 120, 4 )
        }
      };

    const lengthNumberControlOptions =
      {
        delta: 0.1,
        layoutFunction: NumberControl.createLayoutFunction3(),
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.METER_DECIMAL_PLACES,
          valuePattern: StringUtils.fillIn( metersPattern, {
            meters: SunConstants.VALUE_NAMED_PLACEHOLDER
          } )
        },
        sliderOptions: {
          trackSize: new Dimension2( 120, 4 )
        }
      };


    const curvatureRadiusControl = new NumberControl(
      curvatureRadiusString,
      opticalElement.radiusOfCurvatureProperty,
      opticalElement.radiusOfCurvatureProperty.range,
      lengthNumberControlOptions );

    const diameterControl = new NumberControl(
      diameterString,
      opticalElement.diameterProperty,
      opticalElement.diameterProperty.range,
      lengthNumberControlOptions );

    let controls;
    if ( opticalElement.type === OpticalElement.Type.LENS ) {
      const indexOfRefractionControl = new NumberControl(
        refractiveIndexString,
        opticalElement.indexOfRefractionProperty,
        opticalElement.indexOfRefractionProperty.range,
        indexOfRefractionNumberControlOptions );

      controls = [ curvatureRadiusControl,
        indexOfRefractionControl,
        diameterControl ];
    }
    else {
      controls = [ curvatureRadiusControl,
        diameterControl ];
    }


    const rayModeRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      lightRays.modeProperty,
      rayModeRadioButtonGroupItems, {
        spacing: 8,
        align: 'left',
        radioButtonOptions: {
          radius: 7
        },
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10
      } );

    const checkboxGroupItems = [
      {
        node: new Text( focalPointString ),
        property: visibleProperties.visibleFocalPointProperty,
        tandem: tandem
      },
      {
        node: new Text( rulersString ),
        property: visibleProperties.visibleRulersProperty,
        tandem: tandem
      },
      {
        node: new Text( virtualImageString ),
        property: visibleProperties.visibleVirtualImageProperty,
        tandem: tandem
      },
      {
        node: new Text( movablePointString ),
        property: visibleProperties.visibleMovablePointProperty,
        tandem: tandem
      },
      {
        node: new Text( guidesString ),
        property: visibleProperties.visibleGuidesProperty,
        tandem: tandem
      }
    ];
    const checkboxGroup = new VerticalCheckboxGroup( checkboxGroupItems );

    const separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    const curvatureTypesRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      opticalElement.curveProperty,
      curvatureTypesRadioButtonGroupItems, {
        spacing: 8,
        align: 'left',
        radioButtonOptions: {
          radius: 7
        },
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10
      } );

    const content = new AlignBox( new HBox( {
      spacing: 8,
      align: 'left',
      children: [ rayModeRadioButtonGroup,
        separator, ...controls,
        curvatureTypesRadioButtonGroup, checkboxGroup ]
    } ), {
      xAlign: 'left'
    } );

    super( content );

  }
}

geometricOptics.register( 'ControlPanel', ControlPanel );
export default ControlPanel;
