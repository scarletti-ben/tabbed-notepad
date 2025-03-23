// < ========================================================
// < Imports
// < ========================================================

import { utils } from "./utils.js";

// < ========================================================
// < Element Queries
// < ========================================================

let page = document.getElementById('page');
let menuButton = document.getElementById('menu-button');
let menuRail = document.getElementById('menu-rail');
let tabRail = document.getElementById('tab-rail');
let createButton = document.getElementById('create-button');
let saveButton = document.getElementById('save-button');
let loadButton = document.getElementById('load-button');
let clearButton = document.getElementById('clear-button');

// ! ========================================================
// ! Interface
// ! ========================================================

class Interface {

    static toggleMenuRail() {
        let icon = menuButton.firstElementChild;
        let open = icon.textContent === "top_panel_open"
        icon.textContent = open ? "top_panel_close" : "top_panel_open"
        menuRail.classList.toggle("hidden")
    }

    static saveAll() {
        for (let note of Note.instances) {
            Note.saveNote(note);
        }
    }

    static loadAll() {
        for (let [uuid, { title, text, tags }] of Object.entries(StorageHandler.dictionary)) {
            Note.loadNote(uuid, title, text, tags);
        }
    }

    static readLocal() {
        let note = Note.createNote();
        note.text = StorageHandler.toString();
    }

    static objectify(string) {
        return JSON.parse(string);
    }

    static stringify(object, indent = 2) {
        return JSON.stringify(object, null, indent);
    }

}

// < ========================================================
// < StorageHandler Class
// < ========================================================

class StorageHandler {

    static key = 'notes2025-03-23';

    static dictionary;

    static init() {
        let string = localStorage.getItem(this.key);
        if (string === null) {
            string = '{}'
            localStorage.setItem(this.key, string);
        }
        StorageHandler.dictionary = Interface.objectify(string);
    }


    close() {
        this.tab.remove();
        this.editor.remove();
        let index = Note.instances.indexOf(this);
        Note.instances.splice(index, 1);
    }

    destroy() {
        this.close();
        StorageHandler.remove(this.uuid);
    }

    save() {
        StorageHandler.add(this.uuid, {
            title: this.title,
            text: this.text,
            tags: this.tags
        });
    }


    static clear() {
        StorageHandler.dictionary = {}
        localStorage.setItem(this.key, '{}');
        StorageHandler.save()
    }

    /**  @param {string} key @param {string} value */
    static add(key, value) {
        StorageHandler.dictionary[key] = value;
        StorageHandler.save();
    }

    /**  @param {string} key */
    static remove(key) {
        delete StorageHandler.dictionary[key];
        StorageHandler.save();
    }

    static save() {
        let string = Interface.stringify(StorageHandler.dictionary)
        localStorage.setItem(this.key, string);
    }

    static toString() {
        return JSON.stringify(StorageHandler.dictionary, null, 2);
    }

}

// < ========================================================
// < Note Class
// < ========================================================

class Note {

    /** @type {Note[]} */
    static instances = []

    // < ========================================================
    // < Methods for Note Instances
    // < ========================================================

    constructor(uuid, title, text, tags) {
        this.num = this.getNum();
        this.uuid = uuid ? uuid : crypto.randomUUID();
        this.title = title ? title : 'note' + this.num;
        this.tags = tags ? tags : [];
        this.tab = this.createTab();
        this.editor = this.createEditor();
        this.textarea = this.editor.querySelector('textarea');
        this.text = text ? text : '';
        Note.instances.push(this);
    }

    getNum() {
        let nums = Note.instances.map(instance => instance.num);
        return nums.length > 0 ? Math.max(...nums) + 1 : 1;
    }

    createTab() {
        let tab = document.createElement('div');
        tab.classList.add('tab');
        tab.id = 'tab' + this.num;
        tab.innerText = this.title;
        tabRail.insertBefore(tab, createButton);
        tab.onclick = () => Note.showOnly(this);
        tab.title = this.uuid;
        return tab;
    }

    createEditor() {
        let editor = document.createElement('div');
        editor.classList.add('editor');
        editor.id = 'editor' + this.num;
        let textarea = document.createElement('textarea');
        textarea.placeholder = editor.id;
        editor.appendChild(textarea);
        page.appendChild(editor);
        return editor;
    }

    set text(value) {
        if (value === null) return;
        this.textarea.value = value;
    }

    get text() {
        return this.textarea.value;
    }

    // < ========================================================
    // < Static Methods for Creation of Note Instances
    // < ========================================================

    static createNote() {
        let note = new Note();
        Note.showOnly(note);
        return note;
    }

    static loadNote(uuid, title, text, tags) {
        utils.argcheck({ uuid, title, text, tags })
        let note = new Note(uuid, title, text, tags);
        Note.hideNote(note);
        return note;
    }

    // < ========================================================
    // < Static Methods for Manipulating Note Instances
    // < ========================================================

    /** @returns {Note} */
    static getNote(tab) {
        for (let instance of Note.instances) {
            if (instance.tab === tab) {
                return instance;
            }
        }
    }

    /** @param {Note} note */
    static showNote(note) {
        note.tab.classList.add('active');
        note.editor.classList.remove('hidden')
    }

    /** @param {Note} note */
    static hideNote(note) {
        note.tab.classList.remove('active');
        note.editor.classList.add('hidden');
    }

    /** @param {Note} note */
    static showOnly(note) {
        if (note === null) return;
        for (let instance of Note.instances) {
            if (instance !== note) {
                Note.hideNote(instance);
            }
            else {
                Note.showNote(instance);
            }
        }
    }

    /** @param {Note} note */
    static closeNote(note) {
        note.tab.remove();
        note.editor.remove();
        let index = Note.instances.indexOf(note);
        Note.instances.splice(index, 1);
    }

    /** @param {Note} note */
    static destroyNote(note) {
        Note.closeNote(note);
        StorageHandler.remove(note.uuid);
    }

    /** @param {Note} note */
    static saveNote(note) {
        StorageHandler.add(note.uuid, {
            title: note.title,
            text: note.text,
            tags: note.tags
        });
    }

}

// < ========================================================
// < EventHandler Class
// < ========================================================

// > EventHandler class to initialise event listeners 
class EventHandler {

    static mx = 0
    static my = 0

    /** @param {Event} event */
    static mousemove(event) {
        EventHandler.mx = event.clientX;
        EventHandler.my = event.clientY;
    }

    static hovered(selector = null) {
        let target = document.elementFromPoint(EventHandler.mx, EventHandler.my);
        if (selector !== null) {
            let closest = target.closest(selector);
            return closest;
        } else {
            return target;
        }
    }

    /** @param {Event} event */
    static click(event) { }

    /** @param {Event} event */
    static keydown(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            Interface.saveAll();
            alert('Saved')
        }
        else if (event.key === 'Delete') {
            let tab = EventHandler.hovered('.tab');
            if (tab) {
                let note = Note.getNote(tab);
                Note.destroyNote(note);
                // POSTIT - TAB INDEX NEEDED to go to nearest tab
                Note.showOnly(Note.instances[0]);
            }
        }
    }

    /** @param {MouseEvent} event */
    static mousedown(event) {
        if (event.button === 1) {
            const tab = event.target.closest('.tab');
            if (tab) {
                let note = Note.getNote(tab);
                Note.closeNote(note);
                // POSTIT - TAB INDEX NEEDED to go to nearest tab
                Note.showOnly(Note.instances[0]);
            }
        }
    }

    /** Initialise event listeners */
    static init() {
        document.addEventListener("click", EventHandler.click);
        document.addEventListener("mousedown", EventHandler.mousedown);
        document.addEventListener("keydown", EventHandler.keydown);
        document.addEventListener("mouseover", EventHandler.mousemove);
        menuButton.addEventListener("click", Interface.toggleMenuRail);
        saveButton.addEventListener("click", Interface.saveAll);
        loadButton.addEventListener("click", Interface.readLocal);
        clearButton.addEventListener("click", StorageHandler.clear);
        createButton.addEventListener("click", Note.createNote);
    }

}

// < ========================================================
// < Entry Point
// < ========================================================

// > Entry point of the application
function main() {

    EventHandler.init();
    StorageHandler.init();

    Interface.loadAll();

    Note.showOnly(Note.instances[Note.instances.length - 1]);

    // Add file system viewer
    // Add ability to rename notes / tabs
    // Add ability to move tabs
    // Add ability to pin tabs

    setInterval(() => {
        Interface.saveAll();
    }, 5000);

}

// < ========================================================
// < Execution
// < ========================================================

main();
