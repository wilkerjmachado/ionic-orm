import { getFromContainer } from "../../index";
import { RepositoryFactory } from "./RepositoryFactory";
/**
 * Aggregates all repositories of the specific metadata.
 */
export class RepositoryAggregator {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, metadata, queryRunnerProvider) {
        const repositoryFactory = getFromContainer(RepositoryFactory);
        this.metadata = metadata;
        if (metadata.table.isClosure) {
            this.repository = this.treeRepository = repositoryFactory.createTreeRepository(connection, metadata, queryRunnerProvider);
        }
        else {
            this.repository = repositoryFactory.createRepository(connection, metadata, queryRunnerProvider);
        }
        this.specificRepository = repositoryFactory.createSpecificRepository(connection, metadata, this.repository, queryRunnerProvider);
    }
}
//# sourceMappingURL=RepositoryAggregator.js.map