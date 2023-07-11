
declare module "*.css";

declare var $: JQueryStatic;
declare var hg: HitGrab;
declare var app: App;

interface HitGrab {
  utils: {
    TemplateUtil: TemplateUtil
  }
}

interface App {
  pages: {
    CampPage: {
      toggleItemBrowser: (itemClassification: string, hasPresetFilters: boolean) => Promise<boolean>;
      EventToggleBlueprint: string,
      BluePrintTypeItemBrowser: string,
    }
  }
}

declare var eventRegistry : EventRegistry;

interface EventRegistry {
  addEventListener<T extends unknown>(eventName: string, eventCallback: (eventData: any, eventScope: T) => void, eventScope?: T, removeAfterFire?: boolean, weight?: number, uniqueId?: number): void;
}

declare var user: User;

interface User {
  bait_name: string | 0;
  trap_power: number;
  trap_luck: number;
  environment_name: string;
  enviroment_atts: EnvironmentAttributes;
}

interface Component {
  item_id: number;
  name: string; // Pascal With Spacing
  type: string; // snake_case
  classification: string;
  description: string;
  quantity: number;
  thumbnail: string;
  is_removable: boolean;
  thumbnail_transparent: string;
  large: string;
  has_parts: boolean
  thumbnail_large: string;
  tag_types: string[];
}
