/**
 */
export class Alias {
    constructor(name) {
        this.name = name;
    }
    get selection() {
        return this.parentAliasName + "." + this.parentPropertyName;
    }
}
//# sourceMappingURL=Alias.js.map