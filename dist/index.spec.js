"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe('json mapper', () => {
    describe('serialize', () => {
        it('should map properties marked with decorator', () => {
            class Foo {
                constructor() {
                    this.bar = 'bar';
                    this.name = 'name';
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            __decorate([
                index_1.JsonProperty('test'),
                __metadata("design:type", String)
            ], Foo.prototype, "name", void 0);
            let instance = new Foo();
            const result = index_1.serialize(instance);
            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toBe(instance.bar);
            expect(result.test).toBeDefined();
            expect(result.test).toBe(instance.name);
        });
        it('should ignore properties NOT marked with decorator', () => {
            class Foo {
                constructor() {
                    this.bar = 'bar';
                }
            }
            let instance = new Foo();
            const result = index_1.serialize(instance);
            expect(typeof result === 'object').toBe(true);
            expect(result).toEqual({});
            expect(result.bar).not.toBeDefined();
        });
        it('should map array', () => {
            class Foo {
                constructor() {
                    this.bar = ['foo', 'bar'];
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", Array)
            ], Foo.prototype, "bar", void 0);
            let instance = new Foo();
            const result = index_1.serialize(instance);
            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toEqual(instance.bar);
        });
    });
    describe('deserialize', () => {
        it('should map json property to object', () => {
            class Foo {
                constructor() {
                    this.bar = undefined;
                    this.baz = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty('test'),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            __decorate([
                index_1.JsonProperty({ name: 'prop' }),
                __metadata("design:type", String)
            ], Foo.prototype, "baz", void 0);
            let object = {
                test: jasmine.any(String),
                prop: jasmine.any(String)
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBe(object.test);
            expect(result.baz).toBe(object.prop);
        });
        it('should NOT map', () => {
            class Foo {
                constructor() {
                    this.bar = undefined;
                    this.test = undefined;
                    this.baz = undefined;
                    this.bla = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Foo.prototype, "baz", void 0);
            __decorate([
                index_1.JsonProperty('bla'),
                __metadata("design:type", String)
            ], Foo.prototype, "bla", void 0);
            let object = {
                test: jasmine.any(String)
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBeUndefined();
            expect(result.test).toBeUndefined();
            expect(result.baz).toBeUndefined();
        });
        it('should map if no name for property is defined, but name is equal', () => {
            class Foo {
                constructor() {
                    this.bar = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            let object = {
                bar: jasmine.any(String)
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBe(object.bar);
        });
        it('should map nested typed object', () => {
            class Bar {
                constructor() {
                    this.test = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Bar.prototype, "test", void 0);
            class Foo {
                constructor() {
                    this.bar = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty({ classtype: Bar }),
                __metadata("design:type", Bar)
            ], Foo.prototype, "bar", void 0);
            let object = {
                bar: {
                    test: jasmine.any(String)
                }
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar instanceof Bar).toBe(true);
            expect(result.bar.test).toBe(object.bar.test);
        });
        it('should map non typed array', () => {
            class Foo {
                constructor() {
                    this.bar = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", Array)
            ], Foo.prototype, "bar", void 0);
            let object = {
                bar: [
                    jasmine.any(String),
                    jasmine.any(String)
                ]
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(Array.isArray(result.bar)).toBe(true);
            expect(result.bar[0]).toBe(object.bar[0]);
            expect(result.bar[1]).toBe(object.bar[1]);
        });
        it('should map typed array', () => {
            class Bar {
                constructor() {
                    this.name = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Bar.prototype, "name", void 0);
            class Foo {
                constructor() {
                    this.bar = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty({ classtype: Bar }),
                __metadata("design:type", Array)
            ], Foo.prototype, "bar", void 0);
            let object = {
                bar: [
                    { name: jasmine.any(String) }
                ]
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(Array.isArray(result.bar)).toBe(true);
            expect(result.bar[0] instanceof Bar).toBe(true);
            expect(result.bar[0].name).toBe(object.bar[0].name);
        });
    });
    describe('custom converter', () => {
        class DateConverter {
            fromJson(data) {
                return new Date(data);
            }
            toJson(data) {
                return data.toISOString();
            }
        }
        class Foo {
            constructor() {
                this.bar = undefined;
            }
        }
        __decorate([
            index_1.JsonProperty({ customConverter: new DateConverter() }),
            __metadata("design:type", Date)
        ], Foo.prototype, "bar", void 0);
        it('should serialize', () => {
            let instance = new Foo();
            instance.bar = new Date('2017-11-25T22:56:49.079Z');
            const result = index_1.serialize(instance);
            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toBe('2017-11-25T22:56:49.079Z');
        });
        it('should deserialize', () => {
            let object = {
                bar: '2017-11-25T22:56:49.079Z'
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar instanceof Date).toBe(true);
            expect(result.bar).toEqual(new Date(object.bar));
        });
    });
});
