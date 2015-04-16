var SideFlowUtils = classCreate();
objectExtend(SideFlowUtils.prototype, {
    banner: "SideFlow",
    initialize: function() {},
    isIDE: function() {
        return (Application.prototype != undefined);
    },
    formatMessage: function(msg, error) {
        return this.banner + ((error) ? "[" + error.lineNumber + "] " : " ") + msg;
    },
    debug: function(msg, error) {
        LOG.debug(this.formatMessage(msg, error));
    },
    info: function(msg, error) {
        LOG.info(this.formatMessage(msg, error));
    },
    warn: function(msg, error) {
        LOG.warn(this.formatMessage(msg, error));
    },
    error: function(msg, error) {
        LOG.error(this.formatMessage(msg, error));
    },
    throwError: function(err, error) {
        throw new SeleniumError(this.formatMessage(err, error));
    },
    getTestCase: function() {
        if(this.isIDE()) {
            return testCase;
        }
        return new testFrame.getCurrentTestCase();
    },
    getCommands: function() {
        var seleniumCommands;
        if(this.isIDE()) {
            seleniumCommands = this.getTestCase().commands;
        } else {
            seleniumCommands = this.getTestCase().commandRows;
        }
        return seleniumCommands;
    }
});

var SideFlow = classCreate();
objectExtend(SideFlow.prototype, {
    gotoLabels: {},
    whileLabels: { ends: {}, whiles: {} },
    utils: null,

    /*
     * ---   Initialize Conditional Elements  --- *
     *  Run through the script collecting line numbers of all conditional elements
     *  There are three a results arrays: goto labels, while pairs and forEach pairs
     */
    initialize: function(sideFlowUtils) {
        this.utils = sideFlowUtils;
        this.utils.debug("detected runtime = Selenium " + (this.utils.isIDE() ? "IDE" : "RC"), new Error());
        try {
            var commands = this.utils.getCommands(),
                command_rows = [],
                cycles = [],
                forEachCmds = [];
            for (var i = 0; i < commands.length; ++i) {
                command_rows.push(commands[i]);
            }
            for (var i = 0; i < command_rows.length; i++) {
                if (this.utils.isIDE()) {
                    if((command_rows[i].type == 'command')) {
                        switch (command_rows[i].command.toLowerCase()) {
                            case "label":
                                this.gotoLabels[ command_rows[i].target ] = i;
                                break;
                            case "while":
                            case "endwhile":
                                cycles.push([command_rows[i].command.toLowerCase(), i]);
                                break;
                            case "foreach":
                            case "endforeach":
                                forEachCmds.push([command_rows[i].command.toLowerCase(), i]);
                                break;
                        }
                    }
                } else {
                    var command = command_rows[i].trElement.cells[0].innerHTML;
                    var target = command_rows[i].trElement.cells[1].innerHTML;
                    var value = command_rows[i].trElement.cells[2].innerHTML;
                    switch (command.toLowerCase()) {
                        case "label":
                            this.gotoLabels[ target ] = i;
                            break;
                        case "while":
                        case "endwhile":
                            cycles.push([command.toLowerCase(), i]);
                            break;
                        case "foreach":
                        case "endforeach":
                            forEachCmds.push([command.toLowerCase(), i]);
                            break;
                    }
                }
            }
        } catch (err) {
            this.utils.error(err, new Error());
            this.utils.throwError(err, new Error());
        }
        var i = 0;
        while (cycles.length) {
            if (i >= cycles.length) {
                this.utils.throwError("non-matching while/endWhile found", new Error());
            }
            switch (cycles[i][0]) {
                case "while":
                    if (( i + 1 < cycles.length ) && ( "endwhile" == cycles[i + 1][0] )) {
                        // pair found
                        this.whileLabels.ends[ cycles[i + 1][1] ] = cycles[i][1];
                        this.whileLabels.whiles[ cycles[i][1] ] = cycles[i + 1][1];
                        cycles.splice(i, 2);
                        i = 0;
                    } else ++i;
                    break;
                case "endwhile":
                    ++i;
                    break;
            }
        }
    },
    continueFromRow: function (row_num) {
        if (row_num == undefined || row_num == null || row_num < 0) {
            this.utils.throwError("Invalid row_num specified.", new Error());
        }
        if (this.utils.isIDE()) {
            this.utils.getTestCase().debugContext.debugIndex = row_num;
        } else {
            this.utils.getTestCase().nextCommandRowIndex = row_num;
        }
    }
});

var sideFlow = null;
(function() {
    // Proxy design pattern - Overwrite Selenium's reset() function and then invoke the original impl
    var proxied = Selenium.prototype.reset;
    Selenium.prototype.reset = function() {
        sideFlow = new SideFlow(new SideFlowUtils());
        proxied.apply( this, arguments );
    };
})();

// do nothing. simple label
Selenium.prototype.doLabel = function(){};
Selenium.prototype.doGotoLabel = function( label ) {
    if( undefined == sideFlow.gotoLabels[label] ) {
        sideFlow.utils.throwError( "Specified label '" + label + "' is not found.", new Error() );
    }
    sideFlow.continueFromRow( sideFlow.gotoLabels[ label ] );
};

Selenium.prototype.doGoto = Selenium.prototype.doGotoLabel;

Selenium.prototype.doGotoIf = function( condition, label ) {
    if( eval(condition) ) this.doGotoLabel( label );
};

Selenium.prototype.doWhile = function( condition ) {
    if( !eval(condition) ) {
        var last_row;
        if(sideFlow.utils.isIDE()) {
            last_row = sideFlow.utils.getTestCase().debugContext.debugIndex;
        } else {
            last_row = sideFlow.utils.getTestCase().nextCommandRowIndex;
        }
        var end_while_row = sideFlow.whileLabels.whiles[ last_row ];
        if( undefined == end_while_row ) sideFlow.utils.throwError( "Corresponding 'endWhile' is not found.", new Error() );
        sideFlow.continueFromRow( end_while_row );
    }
};

Selenium.prototype.doEndWhile = function() {
    var last_row;
    if(sideFlow.utils.isIDE()) {
        last_row = sideFlow.utils.getTestCase().debugContext.debugIndex;
    } else {
        last_row = sideFlow.utils.getTestCase().nextCommandRowIndex;
    }
    var while_row = sideFlow.whileLabels.ends[ last_row ] - 1;
    if( undefined == while_row ) sideFlow.utils.throwError( "Corresponding 'While' is not found.", new Error() );
    sideFlow.continueFromRow( while_row );
};

Selenium.prototype.doPush = function(value, varName) {
    if(!storedVars[varName]) {
        storedVars[varName] = new Array();
    }
    if(typeof storedVars[varName] !== 'object') {
        sideFlow.utils.throwError("Cannot push value onto non-array " + varName, new Error());
    } else {
        storedVars[varName].push(value);
    }
};