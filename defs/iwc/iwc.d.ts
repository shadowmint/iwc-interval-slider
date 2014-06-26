declare module IWC {
    export interface ComponentDef {
        name: string;
        model: any;
        view: any;
        styles: string;
        template: callbacks.Template;
        targets: callbacks.Targets;
        state: callbacks.State;
        update: callbacks.Update;
        instance: callbacks.Instance;
        preload: callbacks.Preload;
    }
    export interface Component extends ComponentDef {
        namespace: string;
        instances: any;
        loaded: boolean;
    }
    export class Ref {
        private _instance;
        public root:HTMLElement;
        public model:any;
        public view:any;
        public data:any;

        constructor(instance:Instance);

        public update():void;

        public action(act:(r:Ref) => void):void;
    }
    export class Instance {
        public component:Component;
        public root:HTMLElement;
        public model:any;
        public view:any;
        public data:any;
        private _state;

        constructor(root:HTMLElement, component:Component, model:any, view:any);

        public changed(state:any[]):boolean;

        public update(state:any[]):void;

        public state():any[];
    }
    export module callbacks {
        interface State {
            (ref:Ref): any[];
        }
        interface Update {
            (ref:Ref): void;
        }
        interface Change {
            (ref:Ref): void;
        }
        interface Targets {
            (): HTMLElement[];
        }
        interface Template {
            (data:any): string;
        }
        interface Preload {
            (ref:Ref): void;
        }
        interface Instance {
            (ref:Ref): void;
        }
    }

    export function component(data:ComponentDef):void;

    export function load():void;

    interface Data {
        styles: string;
        markup: string;
        resources: any;
    }
    
    class Base {
        /** Name */
        public name:string;
        
        /** Internal data values */
        public _data:Data;

        /** Create a component with a given name */
        constructor(name:string, data:Data);

        /** Return elements */
        public targets():HTMLElement[];

        /** Return the new dom node content */
        public template(data:any):string;

        /** Return an api for working with refs */
        public api():any;

        /** Return the model for this component */
        public model():any;

        /** Return the view for this component */
        public view():any;

        /** Return a state for the component */
        public state(ref:Ref):any[];

        /** Update the component state from the model */
        public update(ref:Ref):void;

        /** Run this on instances once the dom is updated */
        public instance(ref:Ref):void;

        /** Run this on instances before the dom is updated */
        public preload(ref:Ref):void;

        /** Export a definition for this instance */
        public def():ComponentDef;
    }
}

declare module "iwc" {
export = IWC;
}
