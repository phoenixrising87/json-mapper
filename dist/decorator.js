"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const jsonMetadataKey = "jsonProperty";
function JsonProperty(metadata) {
    if (metadata instanceof String || typeof metadata === "string") {
        return Reflect.metadata(jsonMetadataKey, {
            name: metadata,
            classtype: undefined,
            customConverter: undefined
        });
    }
    else {
        let metadataObj = metadata;
        return Reflect.metadata(jsonMetadataKey, {
            name: metadataObj ? metadataObj.name : undefined,
            classtype: metadataObj ? metadataObj.classtype : undefined,
            customConverter: metadataObj ? metadataObj.customConverter : undefined
        });
    }
}
exports.JsonProperty = JsonProperty;
function getClasstype(target, propertyKey) {
    return Reflect.getMetadata("design:type", target, propertyKey);
}
exports.getClasstype = getClasstype;
function getJsonProperty(target, propertyKey) {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
}
exports.getJsonProperty = getJsonProperty;
