import 'reflect-metadata';

export interface ICustomConverter {
    fromJson(data: any): any;
    toJson(data: any): any;
}

export interface IJsonMetaData<T> {
    name?: string,
    classtype?: {new(): T},
    customConverter?: ICustomConverter
}

const jsonMetadataKey = "jsonProperty";
export function JsonProperty<T>(metadata?:IJsonMetaData<T>|string): any {
    if (metadata instanceof String || typeof metadata === "string"){
        return Reflect.metadata(jsonMetadataKey, {
            name: metadata,
            classtype: undefined,
            customConverter: undefined
        });
    } else {
        let metadataObj = <IJsonMetaData<T>>metadata;
        return Reflect.metadata(jsonMetadataKey, {
            name: metadataObj ? metadataObj.name : undefined,
            classtype: metadataObj ? metadataObj.classtype : undefined,
            customConverter: metadataObj ? metadataObj.customConverter : undefined
        });
    }
}

export function getClasstype(target: any, propertyKey: string): any{
    return Reflect.getMetadata("design:type", target, propertyKey)
}

export function getJsonProperty<T>(target: any, propertyKey: string):  IJsonMetaData<T> {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
}