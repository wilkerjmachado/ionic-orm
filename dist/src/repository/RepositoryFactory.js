import { TreeRepository } from "./TreeRepository";
import { Repository } from "./Repository";
import { SpecificRepository } from "./SpecificRepository";
/**
 * Factory used to create different types of repositories.
 */
export class RepositoryFactory {
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a regular repository.
     */
    createRepository(connection, metadata, queryRunnerProvider) {
        return new Repository(connection, metadata, queryRunnerProvider);
    }
    /**
     * Creates a tree repository.
     */
    createTreeRepository(connection, metadata, queryRunnerProvider) {
        return new TreeRepository(connection, metadata, queryRunnerProvider);
    }
    /**
     * Creates a specific repository.
     */
    createSpecificRepository(connection, metadata, repository, queryRunnerProvider) {
        return new SpecificRepository(connection, metadata, repository, queryRunnerProvider);
    }
}
//# sourceMappingURL=RepositoryFactory.js.map