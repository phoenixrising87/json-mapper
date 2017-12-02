"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const decorator_1 = require("./decorator");
exports.JsonProperty = decorator_1.JsonProperty;
function deserialize(Classtype, jsonObject) {
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
        let metaData = decorator_1.getJsonProperty(typedObject, key);
        if (_.isUndefined(metaData)) {
            return;
        }
        if (metaData.customConverter) {
            const data = !_.isUndefined(metaData.name) && !_.isUndefined(jsonObject[metaData.name]) ? jsonObject[metaData.name] : jsonObject[key];
            typedObject[key] = metaData.customConverter.fromJson(data);
        }
        else {
            typedObject[key] = mapFromJson(typedObject, jsonObject, key);
        }
    });
    return typedObject;
}
exports.deserialize = deserialize;
function mapFromJson(instance, json, key) {
    let metaData = decorator_1.getJsonProperty(instance, key);
    if (_.isUndefined(metaData)) {
        return;
    }
    let classType = decorator_1.getClasstype(instance, key);
    let value = !_.isUndefined(metaData.name) && !_.isUndefined(json[metaData.name]) ? json[metaData.name] : json[key];
    if (_.isUndefined(value)) {
        return value;
    }
    if (isArray(classType)) {
        if (metaData.classtype || isPrimitive(classType)) {
            if (!isArray(value)) {
                return;
            }
            return _.map(value, (item) => {
                return deserialize(metaData.classtype, item);
            });
        }
        return value;
    }
    if (!isPrimitive(classType)) {
        return deserialize(classType, value);
    }
    return value;
}
function isArray(classType) {
    if (classType === Array) {
        return true;
    }
    return Object.prototype.toString.call(classType) === '[object Array]';
}
function isPrimitive(obj) {
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
function serialize(instance) {
    if (!_.isObjectLike(instance) || isArray(instance)) {
        return instance;
    }
    const object = {};
    _.forOwn(instance, (value, key) => {
        const metaData = decorator_1.getJsonProperty(instance, key);
        if (_.isUndefined(metaData)) {
            return;
        }
        object[metaData.name ? metaData.name : key] = metaData.customConverter
            ? metaData.customConverter.toJson(value) : serializeProperty(metaData, instance[key]);
    });
    return object;
}
exports.serialize = serialize;
function serializeProperty(metaData, property) {
    if (metaData.classtype) {
        return serialize(property);
    }
    if (isArray(property)) {
        return _.map(property, (item) => serialize(item));
    }
    return property;
}
