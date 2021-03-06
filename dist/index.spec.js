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
        describe('interface', () => {
            it('should serialize to classtype', () => {
                class Bar {
                    constructor() {
                        this.value = undefined;
                        this.value_name = undefined;
                    }
                }
                __decorate([
                    index_1.JsonProperty(),
                    __metadata("design:type", String)
                ], Bar.prototype, "value", void 0);
                __decorate([
                    index_1.JsonProperty('value_rename'),
                    __metadata("design:type", String)
                ], Bar.prototype, "value_name", void 0);
                class BarCopy {
                    constructor() {
                        this.value = 'test';
                        this.value_name = 'test2';
                    }
                }
                class Foo {
                    constructor() {
                        this.bar = new BarCopy();
                    }
                }
                __decorate([
                    index_1.JsonProperty({ classtype: Bar }),
                    __metadata("design:type", Object)
                ], Foo.prototype, "bar", void 0);
                let instance = new Foo();
                const result = index_1.serialize(instance);
                expect(typeof result === 'object').toBe(true);
                expect(result.bar).toBeDefined();
                expect(result.bar.value).toBe(instance.bar.value);
                expect(result.bar.value_rename).toBe(instance.bar.value_name);
            });
            it('should serialize array to classtype', () => {
                class Bar {
                    constructor() {
                        this.value = undefined;
                        this.value_name = undefined;
                    }
                }
                __decorate([
                    index_1.JsonProperty(),
                    __metadata("design:type", String)
                ], Bar.prototype, "value", void 0);
                __decorate([
                    index_1.JsonProperty('value_rename'),
                    __metadata("design:type", String)
                ], Bar.prototype, "value_name", void 0);
                class BarCopy {
                    constructor() {
                        this.value = 'test';
                        this.value_name = 'test2';
                    }
                }
                class Foo {
                    constructor() {
                        this.bars = [new BarCopy(), new BarCopy()];
                    }
                }
                __decorate([
                    index_1.JsonProperty({ classtype: Bar }),
                    __metadata("design:type", Array)
                ], Foo.prototype, "bars", void 0);
                let instance = new Foo();
                const result = index_1.serialize(instance);
                expect(typeof result === 'object').toBe(true);
                expect(result.bars[0]).toBeDefined();
                expect(result.bars[0].value).toBe(instance.bars[0].value);
                expect(result.bars[0].value_rename).toBe(instance.bars[0].value_name);
                expect(result.bars[1]).toBeDefined();
                expect(result.bars[1].value).toBe(instance.bars[1].value);
                expect(result.bars[1].value_rename).toBe(instance.bars[1].value_name);
            });
        });
        it('should map properties marked with decorator', () => {
            let Options;
            (function (Options) {
                Options["KEY"] = "VALUE";
            })(Options || (Options = {}));
            class Foo {
                constructor() {
                    this.bar = 'bar';
                    this.name = 'name';
                    this.enum = Options.KEY;
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
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Foo.prototype, "enum", void 0);
            let instance = new Foo();
            const result = index_1.serialize(instance);
            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toBe(instance.bar);
            expect(result.test).toBeDefined();
            expect(result.test).toBe(instance.name);
            expect(result.enum).toBeDefined();
            expect(result.enum).toBe(Options.KEY);
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
        it('should property from interface to class instance', () => {
            class Bar {
                constructor() {
                    this.value = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Bar.prototype, "value", void 0);
            class Foo {
                constructor() {
                    this.bar = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty({ classtype: Bar }),
                __metadata("design:type", Object)
            ], Foo.prototype, "bar", void 0);
            let object = {
                bar: {
                    value: 'test'
                }
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar.value).toBeDefined();
            expect(result.bar.value).toBe(object.bar.value);
        });
        it('should map json property to object', () => {
            let Options;
            (function (Options) {
                Options["KEY"] = "VALUE";
            })(Options || (Options = {}));
            class Foo {
                constructor() {
                    this.bar = undefined;
                    this.baz = undefined;
                    this.any = undefined;
                    this.options = undefined;
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
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", Object)
            ], Foo.prototype, "any", void 0);
            __decorate([
                index_1.JsonProperty(),
                __metadata("design:type", String)
            ], Foo.prototype, "options", void 0);
            let object = {
                test: jasmine.any(String),
                prop: jasmine.any(String),
                any: 'aaa',
                options: Options.KEY
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBe(object.test);
            expect(result.baz).toBe(object.prop);
            expect(result.any).toBe(object.any);
            expect(result.options).toBe(Options.KEY);
        });
        it('should property if original key already exists', () => {
            class Foo {
                constructor() {
                    this.bar = undefined;
                }
            }
            __decorate([
                index_1.JsonProperty('test'),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            let object = {
                bar: jasmine.any(String)
            };
            const result = index_1.deserialize(Foo, object);
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBe(object.bar);
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
