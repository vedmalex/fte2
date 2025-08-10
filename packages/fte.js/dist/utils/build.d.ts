export type BuildOptions = {
    typescript: boolean;
    format: any;
    pretty: boolean;
    minify: boolean;
    standalone: boolean;
    single: boolean;
    ext: string;
    file: string;
    sourcemap?: boolean;
    inlineMap?: boolean;
};
export declare function build(src: string, dest: string, options: BuildOptions, callback: (err?: unknown) => void): void;
//# sourceMappingURL=build.d.ts.map