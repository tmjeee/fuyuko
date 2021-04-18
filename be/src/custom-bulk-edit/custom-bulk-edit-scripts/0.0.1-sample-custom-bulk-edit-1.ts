import {View} from '@fuyuko-common/model/view.model';
import {NewNotification} from '@fuyuko-common/model/notification.model';
import {LogMessage} from "@fuyuko-common/model/level.model";
import {
    CustomBulkEditContext, CustomBulkEditJob,
    CustomBulkEditScriptInput,
    CustomBulkEditScriptInputValue, CustomBulkEditScriptPreview
} from '@fuyuko-common/model/custom-bulk-edit.model';


/////////////////////////////////////
const scriptName: string = `0.0.1-sample-custom-bulk-edit-1`;

export const description = (): string => {
    return `${scriptName} description`;
}

export const inputs = (): CustomBulkEditScriptInput[] => {
    console.log(`${scriptName} input function`);
    return [
        {
            type: 'string',
            name: 'string input',
            description: 'string input description',
        },
        {
            type: 'number',
            name: 'number input',
            description: 'number input description',
        },
        {
            type: 'date',
            name: 'date input',
            description: 'date input description',
        },
        {
            type: 'checkbox',
            name: 'checkbox input',
            description: 'checkbox input description',
        },
        {
            type: 'select',
            name: 'select input',
            description: 'select input description',
            options: [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'},
                {key: 'key3', value: 'value3'},
                {key: 'key4', value: 'value4'},
            ]
        },
        {
            type: 'file',
            name: 'file input',
            description: 'file input description'
        }
    ];
};

// validate(v: View, values: CustomBulkEditScriptInputValue[]): {valid: boolean, messages: NewNotification[]};
export const validate  = (v: View, values: CustomBulkEditScriptInputValue[]): {valid: boolean, messages: NewNotification[]} => {
    console.log(`${scriptName} validate function`, values);
    return {
        valid: true,
        messages: [{
            status: 'INFO',
            title: "sample info title",
            message: 'sample info message'
        }]
    };
};

// preview(v: View, inputValues: CustomBulkEditScriptInputValue[], ctx: CustomBulkEditContext): CustomBulkEditScriptPreview;
export const preview = (view: View, inputValues: CustomBulkEditScriptInputValue[], ctx: CustomBulkEditContext): CustomBulkEditScriptPreview => {
    console.log(`${scriptName} preview function`, view, inputValues);
    return {
        proceed: true,
        messages: [
            { status: 'INFO', title: 'test', message: 'test message'}
        ],
        columns: [
            'column1', 'column2', 'column3'
        ],
        rows: [
            {
                'column1': 'row1 column1',
                'column2': 'row1 column2',
                'column3': 'row1 column3',
            },
            {
                'column1': 'row2 column1',
                'column2': 'row2 column2',
                'column3': 'row2 column3',
            },
            {
                'column1': 'row3 column1',
                'column2': 'row3 column2',
                'column3': 'row3 column3',
            },
        ]
    };
};

// action(v: View, inputValues: CustomBulkEditScriptInputValue[], preview: CustomBulkEditScriptPreview, ctx: CustomBulkEditContext, log: (logMessage: LogMessage) => void): CustomBulkEditJob;
export const action = (view: View, inputValues: CustomBulkEditScriptInputValue[], preview: CustomBulkEditScriptPreview, ctx: CustomBulkEditContext, log: (logMessage: LogMessage) => void) : CustomBulkEditJob => {
    console.log(`${scriptName} action function`, view, inputValues, preview);
    return {
        run: () => {
            console.log('run custom bulk edit done');
        }
    }
};
