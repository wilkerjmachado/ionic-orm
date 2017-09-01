var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Represents functionality to provide a new query runners, and release old ones.
 * Also can provide always same query runner.
 */
export class QueryRunnerProvider {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(driver, useSingleQueryRunner = false) {
        this.driver = driver;
        this.useSingleQueryRunner = useSingleQueryRunner;
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    get isReleased() {
        return this._isReleased;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Provides a new query runner used to run repository queries.
     * If use useSingleQueryRunner mode is enabled then reusable query runner will be provided instead.
     */
    provide() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.useSingleQueryRunner) {
                if (!this.reusableQueryRunner)
                    this.reusableQueryRunner = yield this.driver.createQueryRunner();
                return this.reusableQueryRunner;
            }
            return this.driver.createQueryRunner();
        });
    }
    /**
     * Query runner release logic extracted into separated methods intently,
     * to make possible to create a subclass with its own release query runner logic.
     * Note: release only query runners that provided by a provideQueryRunner() method.
     * This is important and by design.
     */
    release(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryRunner === this.reusableQueryRunner)
                return;
            return queryRunner.release();
        });
    }
    /**
     * Releases reused query runner.
     */
    releaseReused() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isReleased = true;
            if (this.reusableQueryRunner)
                return this.reusableQueryRunner.release();
        });
    }
}
//# sourceMappingURL=QueryRunnerProvider.js.map