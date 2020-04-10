import {
    CustomImportContext,
    CustomImportJob,
    ImportScriptInput, ImportScriptInputValue,
    ImportScriptPreview
} from "../../model/custom-import.model";
import {Level, LogMessage} from "../../model/level.model";
import {NewNotification} from "../../model/notification.model";
import {View} from "../../model/view.model";

export const description = (): string => {
    return `0.0.1-sample-custom-import-1 description`;
}

export const inputs = (): ImportScriptInput[] => {
    return [
        {
            type: 'string',
            name: 'string input',
            description: 'string xxx input description',
        },
        {
            type: 'number',
            name: 'number input',
            description: 'number xxx input description',
        },
        {
            type: 'date',
            name: 'date input',
            description: 'date xxx input description',
        },
        {
            type: 'checkbox',
            name: 'checkbox input',
            description: 'checkbox xxx input description',
        },
        {
            type: 'select',
            name: 'select input',
            description: 'select xxx input description',
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
            description: 'file xxx input description'
        }
    ];
};


// validate?: (values: ImportScriptInputValue[])=> {valid: boolean, messages: NewNotification[]};
export const validate  = (v:View, values: ImportScriptInputValue[]): {valid: boolean, messages: NewNotification[]} => {
    return {
        valid: true,
        messages: [{
            status: 'INFO',
            title: "sample info title",
            message: 'sample info message'
        }]
    };
}

// preview(v: View, inputValues: ImportScriptInputValue[], ctx: CustomImportContext): ImportScriptPreview;
export const preview = (v: View, inputValues: ImportScriptInputValue[], ctx: CustomImportContext): ImportScriptPreview => {
    return {
        proceed: true,
        messages: [
            { status: 'INFO', title: 'test', message: 'test xxx message'}
        ],
        columns: [
            'column1', 'column2', 'column3'
        ],
        rows: [
            {
                'column1': 'row1 xxx column1',
                'column2': 'row1 xxx column2',
                'column3': 'row1 xxx column3',
            },
            {
                'column1': 'row2 xxx column1',
                'column2': 'row2 xxx column2',
                'column3': 'row2 xxx column3',
            },
            {
                'column1': 'row3 xxx column1',
                'column2': 'row3 xxx column2',
                'column3': 'row3 xxx column3',
            },
        ]
    };
};

// action(v: View, inputValues: ImportScriptInputValue[], preview: ImportScriptPreview, ctx: CustomImportContext, log: (logMessage: LogMessage) => void): CustomImportJob;
export const action = (v: View, inputValues: ImportScriptInputValue[], preview: ImportScriptPreview, ctx: CustomImportContext, log: (logMessage: LogMessage) => void) : CustomImportJob => {
    return {
        run: () => {
            console.log('run custom import done');
        }
    }
};
