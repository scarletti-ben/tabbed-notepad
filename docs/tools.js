// < ========================================================
// < Exported tools Object
// < ========================================================

export const tools = {

    /**
     * > Ensure none of the arguments in passed argObject are undefined
     * @param {{ [key: string]: any }} argObject - Object containing named arguments
     * @throws {Error} If argObject is not a plain object or contains undefined values
     */
    argcheck(argObject) {
        if (argObject === null || typeof argObject !== "object" || Array.isArray(argObject)) {
            throw new Error("argcheck expects exactly one argument of type Object");
        }
        for (const [name, value] of Object.entries(argObject)) {
            if (value === undefined) {
                throw new Error(`Missing required argument: ${name}`);
            }
        }
    },

    objectify(string) {
        return JSON.parse(string);
    },

    stringify(object, indent = 2) {
        return JSON.stringify(object, null, indent);
    },

    selectAll(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

}