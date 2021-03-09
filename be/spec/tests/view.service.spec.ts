import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {
    addOrUpdateViews,
    AddOrUpdateViewsInputView,
    deleteView, getAllViews, getViewById,
    getViewByName
} from '../../src/service';
import {View} from '@fuyuko-common/model/view.model';

describe('view.service', () => {

    beforeAll(async () => {
        setupTestDatabase();
        await setupBeforeAll2();
    }, JASMINE_TIMEOUT);

    it('test addOrUpdateViews and deleteView', async () => {
        const viewName = `XXXView-${Math.random()}`;
        const errs1: string[] = await addOrUpdateViews([
            {
               name: viewName,
               description: viewName
            } as AddOrUpdateViewsInputView
        ]);
        expect(errs1.length).toBe(0);

        const view1: View = await getViewByName(viewName);
        expect(view1.name).toBe(viewName);
        expect(view1.description).toBe(viewName);

        const r1: boolean = await deleteView(view1.id);
        expect(r1).toBe(true)

        const view2: View = await getViewByName(viewName);
        expect(view2).toBeFalsy();
    });

    it ('test getAllViews', async () => {
        const views: View[] = await getAllViews();
        expect(views.length).toBeGreaterThan(1);
    });

    it ('test getViewByName and getViewById', async () => {
        const view1: View = await getViewByName('Test View 1');
        expect(view1).toBeTruthy();
        expect(view1.name).toBe('Test View 1');

        const view2: View = await getViewById(view1.id);
        expect(view2).toBeTruthy();
        expect(view2.id).toBe(view1.id);
    });
});
