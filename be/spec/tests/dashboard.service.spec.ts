import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {
    getUserDashboardSerializedData,
    getUserDashboardWidgetSerializedData,
    saveUserDashboard,
    saveUserDashboardWidgetData
} from '../../src/service';
import {
    DataMap,
    SerializedDashboardFormat, SerializedDashboardWidgetInstanceDataFormat,
    SerializedDashboardWidgetInstanceFormat
} from '@fuyuko-common/model/dashboard-serialzable.model';


describe(`dashboard.service`, () => {

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

    it(`save dashboard widget`, async () => {
        const userId = 1;
        const dashboardWidgetInstanceId = 'WidgetType1Instance1';
        await saveUserDashboardWidgetData(userId, {
            typeId: 'WidgetType1',
            instanceId: dashboardWidgetInstanceId,
            data:  {
                "key1": "value1",
                "key2": "value2",
            }
        } as SerializedDashboardWidgetInstanceDataFormat);

        const dataMap: DataMap = await getUserDashboardWidgetSerializedData(userId, dashboardWidgetInstanceId);
        expect(dataMap['key1']).toBe('value1');
        expect(dataMap['key2']).toBe('value2');
        expect(dataMap['key3']).toBeUndefined();
    });


    it(`save dashboard`, async () => {
        const userId = 1;
        await saveUserDashboard(userId, {
           strategyId: 'strategyXxx',
           instances: [
               {
                   typeId: 'widgetType1',
                   instanceId: 'widgetType1Instance1',
               } as SerializedDashboardWidgetInstanceFormat
           ],
           special: [
               [
                   {
                       typeId: 'widgetType2',
                       instanceId: 'widgetType2Instance1',
                   } as SerializedDashboardWidgetInstanceFormat
               ],
               [
                   {
                       typeId: 'widgetType3',
                       instanceId: 'widgetType3Instance1',
                   } as SerializedDashboardWidgetInstanceFormat
               ]
           ]
        } as SerializedDashboardFormat);


        const d: string = await getUserDashboardSerializedData(userId);
        const x: SerializedDashboardFormat = JSON.parse(d);
        // console.log(util.inspect(x, {depth: 10}));

        expect(x.strategyId).toBe('strategyXxx');
        expect(x.instances.length).toBe(1);
        expect(x.instances[0].typeId).toBe('widgetType1');
        expect(x.instances[0].instanceId).toBe('widgetType1Instance1');
        expect(x.special.length).toBe(2);
        expect(x.special[0][0].typeId).toBe('widgetType2');
        expect(x.special[0][0].instanceId).toBe('widgetType2Instance1');
        expect(x.special[1][0].typeId).toBe('widgetType3');
        expect(x.special[1][0].instanceId).toBe('widgetType3Instance1');
    });
});