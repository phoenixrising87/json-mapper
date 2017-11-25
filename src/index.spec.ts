import { JsonProperty, ICustomConverter, serialize, deserialize } from './index';

describe('json mapper', () => {

    describe('serialize', () => {
        
        it('should map properties marked with decorator', () => {
            class Foo {
                @JsonProperty()
                public bar: string = 'bar';
                @JsonProperty('test')
                public name: string = 'name';
            }

            let instance = new Foo();
            const result = serialize(instance);

            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toBe(instance.bar);
            expect(result.test).toBeDefined();
            expect(result.test).toBe(instance.name);
        });

        it('should ignore properties NOT marked with decorator', () => {
            class Foo {
                public bar: string = 'bar';
            }

            let instance = new Foo();
            const result = serialize(instance);

            expect(typeof result === 'object').toBe(true);
            expect(result).toEqual({});
            expect(result.bar).not.toBeDefined();
        });

        it('should map array', () => {
            class Foo {
                @JsonProperty()
                public bar: string[] = ['foo','bar'];
            }

            let instance = new Foo();
            const result = serialize(instance);

            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toEqual(instance.bar);
        });
    });

    describe('deserialize', () => {
        
        it('should map json property to object', () => {
            class Foo {
                @JsonProperty('test')
                public bar: string = undefined;
                @JsonProperty({ name: 'prop' })
                public baz: string = undefined;
            }
    
            let object = {
                test: jasmine.any(String),
                prop: jasmine.any(String)
            };
            const result = deserialize(Foo, object);
    
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBe(object.test);
            expect(result.baz).toBe(object.prop);
        });
    
        it('should NOT map', () => {
            class Foo {
                public bar: string = undefined;
                public test: string = undefined;     
                @JsonProperty()
                public baz: string = undefined;        
                @JsonProperty('bla')
                public bla: string = undefined;     
            }
    
            let object = {
                test: jasmine.any(String)
            };
            const result = deserialize(Foo, object);
    
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBeUndefined();
            expect(result.test).toBeUndefined();
            expect(result.baz).toBeUndefined();
        });
    
        it('should map if no name for property is defined, but name is equal', () => {
            class Foo {
                @JsonProperty()
                public bar: string = undefined;
            }
    
            let object = {
                bar: jasmine.any(String)
            };
            const result = deserialize(Foo, object);
    
            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBe(object.bar);
        });
    
        it('should map nested typed object', () => {
            class Bar {
                @JsonProperty()
                public test: string = undefined;
            }
            class Foo {
                @JsonProperty({ classtype: Bar })
                public bar: Bar = undefined;
            }
    
            let object = {
                bar: {
                    test: jasmine.any(String)
                }
            };
            const result = deserialize(Foo, object);
    
            expect(result instanceof Foo).toBe(true);
            expect(result.bar instanceof Bar).toBe(true);
            expect(result.bar.test).toBe(object.bar.test);
        });
    
        it('should map non typed array', () => {
            class Foo {
                @JsonProperty()
                public bar: string[] = undefined;
            }
    
            let object = {
                bar: [
                    jasmine.any(String),
                    jasmine.any(String)
                ]
            };
            const result = deserialize(Foo, object);
    
            expect(result instanceof Foo).toBe(true);
            expect(Array.isArray(result.bar)).toBe(true);
            expect(result.bar[0]).toBe(object.bar[0]);
            expect(result.bar[1]).toBe(object.bar[1]);
        });
    
        it('should map typed array', () => {
            class Bar {
                @JsonProperty()
                public name: string = undefined;
            }
            class Foo {
                @JsonProperty({ classtype: Bar })
                public bar: Bar[] = undefined;
            }
    
            let object = {
                bar: [
                    { name: jasmine.any(String) }
                ]
            };
            const result = deserialize(Foo, object);
    
            expect(result instanceof Foo).toBe(true);
            expect(Array.isArray(result.bar)).toBe(true);
            expect(result.bar[0] instanceof Bar).toBe(true);
            expect(result.bar[0].name).toBe(object.bar[0].name);
        });
    });

    describe('custom converter', () => {

        class DateConverter implements ICustomConverter {
            public fromJson(data: string): Date {
                return new Date(data);
            }
            public toJson(data: Date): string {
                return data.toISOString()
            }
        }

        class Foo {
            @JsonProperty({ customConverter: new DateConverter() })
            public bar: Date = undefined;
        }
        
        it('should serialize', () => {
            let instance = new Foo();
            instance.bar = new Date('2017-11-25T22:56:49.079Z');

            const result = serialize(instance);

            expect(typeof result === 'object').toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar).toBe('2017-11-25T22:56:49.079Z');
        });

        it('should deserialize', () => {
            let object = {
                bar: '2017-11-25T22:56:49.079Z'
            };
            const result = deserialize(Foo, object);

            expect(result instanceof Foo).toBe(true);
            expect(result.bar).toBeDefined();
            expect(result.bar instanceof Date).toBe(true);
            expect(result.bar).toEqual(new Date(object.bar));
        });
    });
});