
/**
 * Eg.
 * serializedData: string = JSON.stringify({
 *       strategyId: '2x',
 *       instances: [
 *           {instanceId: '1', typeId: Sample1WidgetComponent.info().id },
 *           {instanceId: '2', typeId: Sample1WidgetComponent.info().id },
 *           {instanceId: '3', typeId: Sample2WidgetComponent.info().id },
 *           {instanceId: '4', typeId: Sample2WidgetComponent.info().id },
 *       ],
 *       special: [
 *           [
 *               {instanceId: '1', typeId: Sample1WidgetComponent.info().id },
 *               {instanceId: '2', typeId: Sample1WidgetComponent.info().id },
 *           ],
 *           [
 *               {instanceId: '3', typeId: Sample2WidgetComponent.info().id },
 *               {instanceId: '4', typeId: Sample2WidgetComponent.info().id },
 *           ]
 *       ]
 *    } as SerializeFormat);
 */

export interface SerializeInstanceFormat {
    instanceId: string;
    typeId: string;
}

export interface SerializeFormat {
    strategyId: string;
    instances: SerializeInstanceFormat[];
    special: SerializeInstanceFormat[][] | any;
}
