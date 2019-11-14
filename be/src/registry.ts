import {range} from "./util";

export type RegistryItem = {path: string, description: string};

export class Registry {
    name: string;
    children: Registry[];
    items: RegistryItem[];
    constructor(n: string) {
        this.name = n;
        this.children = [];
        this.items = [];
    }
    static newRegistry(n: string): Registry {
        return new Registry(n);
    }
    newRegistry(n: string): Registry {
        const registry = new Registry(n);
        this.children.push(registry);
        return registry;
    }
    addItem(path: string, description: string) {
        this.items.push({path, description} as RegistryItem);
    }
    print(arg = {indent: 0, text: ''}) {
        range(0, arg.indent).forEach(()=> arg.text += ' ');
        arg.text += `${this.name}\n`;
        for (const child of this.children) {
            arg.indent += 2;
            child.print(arg);
        }
        for (const item of this.items) {
            range(0, arg.indent + 2).forEach(()=> arg.text += ' ');
            arg.text += `${item.path} - ${item.description}\n`;
        }
        return arg;
    }
}
