/**
 */
export class QueryRunnerAlreadyReleasedError extends Error {
    constructor() {
        super();
        this.name = "QueryRunnerAlreadyReleasedError";
        this.message = `Query runner already released. Cannot run queries anymore.`;
    }
}
//# sourceMappingURL=QueryRunnerAlreadyReleasedError.js.map