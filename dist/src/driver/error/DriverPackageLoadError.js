/**
 * Thrown when some unexpected error occur on driver packages load.
 */
export class DriverPackageLoadError extends Error {
    constructor() {
        super();
        this.name = "DriverPackageLoadError";
        this.message = `Cannot load driver dependencies. Try to install all required dependencies.`;
    }
}
//# sourceMappingURL=DriverPackageLoadError.js.map