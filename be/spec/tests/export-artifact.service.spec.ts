import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {doInDbConnection, QueryResponse} from "../../src/db";
import {Connection} from "mariadb";
import {deleteExportArtifactById, getAllExportArtifacts, getExportArtifactContent} from "../../src/service";
import {DataExportArtifact} from "../../src/model/data-export.model";
import {BinaryContent} from "../../src/model/binary-content.model";


describe('export-artifact.service', () => {
    let exportName1: string = `name-${new Date().toString()}`;
    let exportName2: string = `name-${new Date().toString()}`;

    beforeAll(() => {
        setupTestDatabase();
    });
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);

    beforeAll((done: DoneFn) => {
        const content: string = `test`;
        doInDbConnection(async (conn: Connection) => {
            const qr1: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_EXPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,?)`,
                [1, exportName1, 'item']);
            const q1: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_EXPORT_FILE (DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                [qr1.insertId, exportName1, 'text/plain', content.length, content]);
            const qr2: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_EXPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,?)`,
                [1, exportName2, 'item']);
            const q2: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_EXPORT_FILE (DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                [qr2.insertId, exportName2, 'text/plain', content.length, content]);
        }).then(() => done());
    });

    it (`getAllExportArtifacts()`, async () => {

        const dataExportArtifacts: DataExportArtifact[] = await getAllExportArtifacts();
        // console.log(util.inspect(dataExportArtifacts, {depth: 10}));

        expect(dataExportArtifacts.length).toBeGreaterThanOrEqual(2);
        expect(dataExportArtifacts[0].name).toBe(exportName1);
        expect(dataExportArtifacts[0].type).toBe('item');
        expect(dataExportArtifacts[0].view.id).toBe(1);
        expect(dataExportArtifacts[1].name).toBe(exportName2);
        expect(dataExportArtifacts[1].type).toBe('item');
        expect(dataExportArtifacts[1].view.id).toBe(1);

        const bc1: BinaryContent = await getExportArtifactContent(dataExportArtifacts[0].id);
        const bc2: BinaryContent = await getExportArtifactContent(dataExportArtifacts[1].id);

        expect(bc1).toBeDefined();
        expect(bc2).toBeDefined();

        const r1: boolean = await deleteExportArtifactById(dataExportArtifacts[0].id);
        const r2: boolean = await deleteExportArtifactById(dataExportArtifacts[1].id);


        expect(r1).toBe(true);
        expect(r2).toBe(true);

        const _bc1: BinaryContent = await getExportArtifactContent(dataExportArtifacts[0].id);
        const _bc2: BinaryContent = await getExportArtifactContent(dataExportArtifacts[1].id);

        expect(_bc1).toBeFalsy();
        expect(_bc2).toBeFalsy();
    });
});