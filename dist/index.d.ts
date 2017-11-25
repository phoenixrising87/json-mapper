import { JsonProperty, ICustomConverter } from './decorator';
export { JsonProperty, ICustomConverter };
export declare function deserialize<T>(Classtype: {
    new (): T;
}, jsonObject: any): T;
export declare function serialize(instance: any): any;
