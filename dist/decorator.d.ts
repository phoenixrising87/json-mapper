import 'reflect-metadata';
export interface ICustomConverter {
    fromJson(data: any): any;
    toJson(data: any): any;
}
export interface IJsonMetaData<T> {
    name?: string;
    classtype?: {
        new (): T;
    };
    customConverter?: ICustomConverter;
}
export declare function JsonProperty<T>(metadata?: IJsonMetaData<T> | string): any;
export declare function getClasstype(target: any, propertyKey: string): any;
export declare function getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T>;
