import * as _ from 'lodash';
import { IJsonMetaData, JsonProperty, ICustomConverter, getClasstype, getJsonProperty } from './decorator';

export { JsonProperty, ICustomConverter };

export function deserialize<T>(Classtype: { new(): T }, jsonObject): T {
    if (!_.isObjectLike(jsonObject)) {
        return void 0;
    }
    if (_.isUndefined(jsonObject)) {
        return void 0;
    }
    if (_.isUndefined(Classtype)) {
        return void 0;
    }

    let typedObject = new Classtype();
    _.forOwn(typedObject, (value, key) => {
        let metaData = getJsonProperty(typedObject, key);
        if (_.isUndefined(metaData)) {
            return;
        }
        if (metaData.customConverter) {
            const data = !_.isUndefined(metaData.name) && !_.isUndefined(jsonObject[metaData.name]) ? jsonObject[metaData.name] : jsonObject[key];
            typedObject[key] = metaData.customConverter.fromJson(data);
        } else {
            typedObject[key] = mapFromJson(typedObject, jsonObject, key);
        }
    });
    return typedObject;
}

function mapFromJson<T>(instance: T, json: any, key: string): any {
    let metaData = getJsonProperty(instance, key);
    if (_.isUndefined(metaData)) {
        return;
    }
    let classType = getClasstype(instance, key);
    let value = !_.isUndefined(metaData.name) && !_.isUndefined(json[metaData.name]) ? json[metaData.name] : json[key];
    if (_.isUndefined(value)) {
        return value;
    }

    if (isArray(classType)) {
        if (metaData.classtype || isPrimitive(classType)) {
            if (!isArray(value)) {
                return;
            }
            return _.map(value, (item: any) => {
                return deserialize(metaData.classtype, item);
            });
        }
        return value;
    }
    
    if (!isPrimitive(classType) && !isPrimitive(value)) {
        if (metaData.classtype) {
            return deserialize(metaData.classtype, value);
        }
        return deserialize(classType, value);
    }
    return value;
}

function isArray(classType): boolean {
    if (classType === Array) {
        return true;
    }
    return Object.prototype.toString.call(classType) === '[object Array]';
}

function isPrimitive(obj): boolean {
    switch (typeof obj) {
        case 'string':
        case 'number':
        case 'boolean':
            return true;
    }
    return !!(obj instanceof String || obj === String ||
    obj instanceof Number || obj === Number ||
    obj instanceof Boolean || obj === Boolean);
}

export function serialize(instance: any, metaData?: IJsonMetaData<any>): any {
    
    if (!_.isObjectLike(instance) || isArray(instance)) {
        return instance;
    }

    const object: any = {};
    if (metaData && metaData.classtype) {
        let typedObject = new metaData.classtype();
        _.forOwn(typedObject, (value, key) => {
            const metaData = getJsonProperty(typedObject, key);
            if (_.isUndefined(metaData)) {
                return;
            }
            object[metaData.name ? metaData.name : key] = metaData.customConverter 
                ? metaData.customConverter.toJson(value) : serializeProperty(metaData, instance[key]);
        });
        return object;
    }
    
    _.forOwn(instance, (value, key) => {
        const metaData = getJsonProperty(instance, key);
        if (_.isUndefined(metaData)) {
            return;
        }
        object[metaData.name ? metaData.name : key] = metaData.customConverter 
            ? metaData.customConverter.toJson(value) : serializeProperty(metaData, instance[key]);
    });
    return object;
}

function serializeProperty(metaData: IJsonMetaData<any>, property: any): any {

    if (isArray(property)) {        
        return _.map(property, (item: any) => {
            if (metaData.classtype) {
                return serialize(property, metaData);
            }

            return serialize(item);
        });
    }

    if (metaData.classtype) {
        return serialize(property, metaData);
    }

    return property;
}