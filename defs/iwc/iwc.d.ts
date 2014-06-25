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
      public root: HTMLElement;
      public model: any;
      public view: any;
      public data: any;
      constructor(instance: Instance);
      public update(): void;
      public action(act: (r: Ref) => void): void;
  }
  export class Instance {
      public component: Component;
      public root: HTMLElement;
      public model: any;
      public view: any;
      public data: any;
      private _state;
      constructor(root: HTMLElement, component: Component, model: any, view: any);
      public changed(state: any[]): boolean;
      public update(state: any[]): void;
      public state(): any[];
  }
  export module callbacks {
      interface State {
          (ref: Ref): any[];
      }
      interface Update {
          (ref: Ref): void;
      }
      interface Change {
          (ref: Ref): void;
      }
      interface Targets {
          (): HTMLElement[];
      }
      interface Template {
          (data: any): string;
      }
      interface Preload {
          (ref: Ref): void;
      }
      interface Instance {
          (ref: Ref): void;
      }
  }

  export function component(data: ComponentDef): void;
  export function load(): void;
}

declare module "iwc" {
  export = IWC;
}
