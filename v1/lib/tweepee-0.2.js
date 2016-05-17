(function (global) {

    //== Utils and polyfills==
    var mod = function (a, n) {
        return ((a % n) + n) % n; //fix negative modulo
    };


    if (!String.prototype.trim) {
        (function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
                return this.replace(rtrim, '');
            };
        })();
    }
    //

    var tweepee = {};

    var dialogs = {};

    var state = {
        currentDialog: null,
        currentEntry: null,
        linkCount: 0,
        selectedLink: 0,
        selectedLinkEntry: null,
        variables: {},
        path_taken: {} // map: dialog-title->title
    };

    var pathTakenKey = function (fromDialog, fromTitle, toDialog, toTitle) {
        return fromDialog + "~" + fromTitle + "~>" + toDialog + "~" + toTitle;
    };

    var keyboardHandlerEnabled = false;

    function keyboardHandler(e) {
        if (keyboardHandlerEnabled) {
            switch (e.keyCode) {
                case 32: //space
                    if (state.selectedLinkCloses)
                        tweepee.closeCallback(state.currentDialog, state.selectedLinkEntry, state.selectedLinkId);
                    else
                        tweepee.update(state.currentDialog, state.selectedLinkEntry,state.selectedLinkId);
                    break;
                case 38: //up
                    state.selectedLink = mod((state.selectedLink - 1), state.linkCount);
                    tweepee.update(state.currentDialog, state.currentEntry);
                    break;
                case 40: //down
                    state.selectedLink = mod((state.selectedLink + 1), state.linkCount);
                    tweepee.update(state.currentDialog, state.currentEntry);
                    break;
            }

        }
    }

    global.addEventListener("keydown", keyboardHandler, false);

    var updateCallback = function (name, title) {
        console.log('Use tweepee.registerUpdateCallback()');
    };

    var closeCallback = function (name, title) {
        console.log('Use tweepee.registerCloseCallback()');
    };


    function getTags(match) {
        var result = {};
        if (typeof match !== 'undefined') {
            var array = match.replace(/[\[\]]/g, '').trim().split(' ')
            for (var i = 0; i < array.length; ++i) {
                result['' + array[i]] = true;
            }
        }
        return result;
    }

    tweepee.addDialog = function (name, data) {
        var dialog = {};
        var rawEntries = data.split('::');
        for (var i = 0; i < rawEntries.length; i++) {
            var rawEntry = rawEntries[i];

            if (rawEntry) {
                var n = rawEntry.indexOf('\n');
                var titleLine = rawEntry.slice(0, n);
                var content = rawEntry.slice(n + 1);
                var match = titleLine.match(/([\w\s]*)(\[.*\])?/);
                var title = (match[1] || '').trim();
                var tags = getTags(match[2]);

                dialog[title] = {"title": title, "tags": tags, "content": content};
            }
        }
        dialogs[name] = dialog;
    };

    tweepee.getEntryInfo = function (name, title) {
        return dialogs[name][title];
    };

    /**
     * Interpretes all implemented Macros and produces a text only holding [[links]] and markup
     * that can be rendered in a second step.
     *
     * The links might be enriched by an internal id [[linkTitle|link:id]]
     * This id will be used by the state.path_taken history and must be rendered out by the renderEntry function.
     *
     * Supportes macros:
     *  * <<display >>
     *  * <<actions >>
     *
     * Supported markup:
     *  * None yet
     *
     *
     * @param name
     * @param title
     */
    var preprocessEntry = function (name, title) {

        var entry = tweepee.getEntryInfo(name, title);
        var content = "";

        if (entry) {
            content = entry.content;

            //<<display *>> - Macro
            var DISPLAY_REGEX = /<<display\s*\"([^\"]+)\"\s*>>/ig;
            var DISPLAY_REPLACER = function (match, title) {
                var include = preprocessEntry(name, title);
                if (include) {
                    return include;
                }
                console.error('Unknown passage included by display macro');
                return "";
            };
            content = content.replace(DISPLAY_REGEX, DISPLAY_REPLACER);


            //<<actions "a" "b" .. >> Macro
            var ACTIONS_REGEX = /<<actions\s*(\"([^\"]+)\"\s*)+>>/ig;
            var ACTIONS_REPLACER = function (macro) {
                var actionsString = macro
                    .slice(9 /*"<<actions" */, -2 /* >> */)
                    .trim();
                var regex = /"([^"]*)"+/g;
                var matches, actions = [];
                while(matches = regex.exec(actionsString)){
                    actions.push(matches[1]);
                }
                console.log(actions);


                //Remove backwards
                var i = actions.length;
                while(i--) {
                    var toTitle = actions[i];
                    if (state.path_taken[pathTakenKey(name, title, name, toTitle)])
                        actions.splice(i, 1);
                }

                //Print forwards
                var ret = (actions.length > 0) ? '<ul class=\'tweepee_ul\'>' : '';
                for (var j = 0; j < actions.length; j++) {
                    ret += '<li>[[' + actions[j] + ':' + pathTakenKey(name,title,name,actions[j]) + ']]</li>';
                }
                ret += (actions.length > 0) ? '</ul>' : '';
                return ret;
            };

            content = content.replace(ACTIONS_REGEX, ACTIONS_REPLACER);

        }
        return content;
    };

    var renderEntry = function (name,content) {
        var hasBranch = false;
        if (content) {

            state.linkCount = 0;
            //Parse Links
            var LINK_REGEX = /\[\[([^\]]+)\]\]/g
            var LINK_REPLACER = function (match, link) {
                var classes = "tweepee_link";


                var idSplit = link.split(":");
                var id = null;
                if (idSplit.length > 1) {
                    id = idSplit[1];
                    link = idSplit[0];
                }

                var split = link.split('|');
                var displayName, linkTitle;
                if (split.length == 1) {
                    displayName = linkTitle = split[0];
                } else {
                    displayName = split[0];
                    linkTitle = split[1];
                }

                var info = tweepee.getEntryInfo(name, linkTitle);
                var close = (!info || info.tags['close']);

                if (state.linkCount === state.selectedLink) {
                    classes += " tweepee_selected";
                    state.selectedLinkEntry = linkTitle;
                    state.selectedLinkCloses = close;
                    state.selectedLinkId = id;
                }
                state.linkCount++;

                var method = (close)?"closeCallback":"update";

                return '<a class=\'' + classes + '\' ' +
                        'href="javascript:tweepee.'+method+'(\'' + name + "\',\'" + linkTitle + '\',\'' + id + '\');" >'
                        + displayName +
                        '</a>';

            };
            //Order is important here becaus [[Links]] could be produced by MACRO
            content = content.replace(LINK_REGEX, LINK_REPLACER);

            //Create html newlines
            content = content.replace(/\n/g, '<br/>');
        }
        return content;
    };


    tweepee.getEntry = function (name, title) {
        var preprocessed = preprocessEntry(name, title);
        return renderEntry(name,preprocessed);
    };

    tweepee.start = function (name, title) {
        //todo: Reset state
        //path_take = {}
        this.update(name, title);
    };

    tweepee.update = function (name, title, pathKey) {
        if ((state.currentDialog !== name || state.currentEntry !== title)) {
            if (pathKey !== 'null' || pathKey !== null)
                state.path_taken[pathKey] = true;
            state.selectedLink = 0;
            state.selectedLinkEntry = null;
        }
        state.currentDialog = name;
        state.currentEntry = title;
        if (updateCallback)
            updateCallback(name, title);
    };

    tweepee.closeCallback = function (name, title, pathKey) {
        state.path_taken[pathTakenKey(state.currentDialog, state.currentEntry, name, title)] = true;
        if (closeCallback)
            closeCallback(name, title);
    };

    tweepee.debugInfo = function () {
        console.log("=== DIALOGS ===");
        console.log(JSON.stringify(dialogs, null, 2));
        console.log("=== STATE ===");
        console.log(JSON.stringify(state, null, 2));
    };

    tweepee.enableKeyboardHandler = function () {
        keyboardHandlerEnabled = true;
    };


    tweepee.disableKeyboardHandler = function () {
        keyboardHandlerEnabled = false;
    };


    tweepee.registerUpdateCallback = function (cb) {
        updateCallback = cb;
    };

    tweepee.registerCloseCallback = function (cb) {
        closeCallback = cb;
    };

    global.tweepee = tweepee;


})
(this);