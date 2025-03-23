// < ========================================================
// < Exported utils Object
// < ========================================================

export const utils = {

    logging: false,

    /**
     * Sort an array using a key function, with optional reverse
     * 
     * @param {Array<T>} array - The array to sort
     * @param {(item: T) => number} key - Function that returns a numeric sort value
     * @param {boolean} [reverse=false] - Whether to reverse the sort order
     * @returns {Array<T>} - The sorted array
     * @template T
     */
    sort(array, key, reverse = false) {
        return array.sort((a, b) => {
            const comparison = key(a) - key(b);
            return reverse ? -comparison : comparison;
        });
    },

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

    // > Get ISO date time string YYYY-MM-DDTHH:mm:ss.sssZ
    getDateString() {
        const date = new Date();
        const string = date.toISOString();
        return string;
    },

    /**
     * @param {(progress: number) => void} callback - A function that takes accepts ticker progress (0 to 1) as an argument
     * @param {number} duration - The duration in milliseconds for the ticker to run for
     * @returns {Promise<string>} A promise that resolves when the ticker is finished, outputting string message
     */
    ticker(callback, duration) {
        return new Promise((resolve) => {
            let start = performance.now();
            function tick() {
                let current = performance.now();
                let elapsed = current - start;
                let progress = Math.min(elapsed / duration, 1);
                callback(progress);
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    resolve('ticker finished');
                }
            }
            requestAnimationFrame(tick);
        });
    },

    constrain(x, min, max) {
        return Math.min(Math.max(x, min), max);
    },

    /**
     * Remove an item from an array
     * 
     * @param {Array<T>} array - The array to remove the item from
     * @param {T} item - The item to remove from the array
     * @returns {Array<T>} - The array with the item removed
     * @template T
     */
    remove(array, item) {
        const index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    },

    typestring(item) {
        console.log(Object.prototype.toString.call(item))
    },

    logClassName(item) {
        console.log('ClassName: ', item.constructor.name)
    },

    /** 
     * ~ Get a random element from an array
     * @param {Array} arrayA
     * @returns {*} A random element from the array
     */
    choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /** 
     * > Moves an element to a new container without losing child references
     * @param {HTMLElement} element - The element to move
     * @param {HTMLElement} newParent - The new container
     * @returns {null}
     */
    safemove(element, newParent) {
        const overlays = element.querySelectorAll('element-overlay');
        newParent.appendChild(element);
        overlays.forEach(overlay => element.appendChild(overlay));
    },

    /** 
     * ~ Shuffle an array in place  
     * @param {Array} array - The array to shuffle  
     * @returns {undefined}  
     */
    shuffle(array) {
        let currentIndex = array.length;
        while (currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    },

    log(...data) {
        if (utils.logging) {
            console.log(...data)
        }
    },

    warn(...data) {
        if (utils.logging) {
            console.warn(...data)
        }
    },

    error(...data) {
        if (utils.logging) {
            console.error(...data)
        }
    },


    range(func, n = 1) {
        Array.from({ length: n }).forEach(func);
    },

    /**
     * ~ Postpone a callback to the next stack, to avoid JavaScript quirks
     * @param {Function} callback
     * @returns {undefined}
     */
    postpone(callback) {
        setTimeout(callback, 0);
    },


    /**
     * Defer callback to the next event loop iteration, to avoid JavaScript quirks, and return Promise for .then() chaining
     * @param {Function} callback
     * @returns {Promise} Returns a Promise that resolves after the timeout
     */
    defer(callback) {
        return new Promise(resolve => {
            setTimeout(() => {
                callback();
                resolve();
            }, 0);
        });
    },

    /** 
     * ~ Toggle visibility for an element via .hidden class
     * @param {HTMLElement} element
     * @returns {undefined}
     */
    toggleHidden(element, hidden) {
        element.classList.toggle('hidden', hidden);
    },

    /** 
     * ~ Toggle blur for an element via .blurred class
     * @param {HTMLElement} element
     * @returns {undefined}
     */
    toggleBlurred(element, blurred) {
        element.classList.toggle('blurred', blurred);
    },

    /** 
     * ~ Toggle visibility for an element via .invisible class
     * @param {HTMLElement} element
     * @returns {undefined}
     */
    toggleInvisible(element, invisible) {
        element.classList.toggle('invisible', invisible);
    },


    assert(condition, message) {
        if (!condition) {
            throw new Error(`UserError: ${message}`);
        }
        return true;
    },

    setDragImage(event, element) {
        element.style.zIndex = '999';
        utils.postpone(() => {
            event.dataTransfer.setDragImage(element, 0, 0);
            element.style.zIndex = '';
        })
    },


    logger: {

        original: console.log,
        messages: [],

        start() {
            function current(...args) {
                let message = args.map(String).join(" ");
                utils.logger.messages.push(message);
                utils.logger.original.apply(console, args);
            }
            console.log = current;
        },

        download() {
            const blob = new Blob([this.messages.join("\n")], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "console_log.txt";
            link.click();
        },

        finish() {
            console.log = utils.logger.original;
        }

    },

    randint(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    title(str) {
        return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
    }


};