
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

export interface SerializedDashboardWidgetInstanceFormat {
    instanceId: string;
    typeId: string;
}

export interface SerializedDashboardFormat {
    strategyId: string;
    instances: SerializedDashboardWidgetInstanceFormat[];
    special: SerializedDashboardWidgetInstanceFormat[][] | any;
}

export interface SerializedDashboardWidgetInstanceDataFormat {
    instanceId: string;
    typeId: string;
    data: DataMap;
}

export interface DataMap {
    [k: string]: string;
}
