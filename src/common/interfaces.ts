import { TemplateFactoryBase } from './factory';
import { createInterface } from 'readline';
export type HashType = {
  [key: string]: any;
};

export type HashTypeGeneric<T> = {
  [key: string]: T;
};

export type PartialFunction = (obj: HashType, name: string) => string;

export type SlotFunction = (
  name: string,
  content: string | string[],
) => void | string;

export type SlotsHash = { [key: string]: string[] };

export type ContentFunction = (
  name: string,
  context: HashType,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
) => string;

export type BlockRunFunction = (
  context: HashType,
  content: ContentFunction,
  partial: PartialFunction,
  slot: SlotFunction,
) => string;

export type BlockContent = {
  partial: PartialFunction;
  content: ContentFunction;
  run: BlockRunFunction;
  slots: SlotsHash;
  slot: SlotFunction;
};

export type BlocksHash = HashTypeGeneric<BlockRunFunction>;

export type TemplateConfig = {
  source?: string;
  name?: string;
  absPath?: string;
  parent?: string;
  blocks?: BlocksHash;
  slots?: BlocksHash;
  aliases?: HashTypeGeneric<string>;
  alias?: string[];
  dependency?: HashTypeGeneric<boolean>;
  srcCode?: string;
  script?: BlockRunFunction;
  factory?: TemplateFactoryBase;
  compile?: () => void;
};
