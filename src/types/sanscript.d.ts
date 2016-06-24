declare module "sanscript" {
    namespace Sanscript {
        function t(data: string, from: string, to: string, options?: Object): string;
        function isRomanScheme(name: string): boolean;
        function addBrahmicScheme(name: string, scheme: string): void;
        function addRomanScheme(name: string, scheme: Object | any): void;
    }

    export = Sanscript;
}
