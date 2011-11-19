/*
This toolkit is the work of Andrey Yegorov & Darren DeRidder of the Ottawa office of Kindsight

The ForEach stuff at the bottom below the separator is a contribution by Martin H. Bramwell, 2011/11
*/

var forEachLabels = {};  // mhb:20111107

var gotoLabels= {};
var whileLabels = {};

// overload the original Selenium reset function
Selenium.prototype.reset = function() {
    // reset the labels
    this.initialiseLabels();
    // proceed with original reset code
    this.defaultTimeout = Selenium.DEFAULT_TIMEOUT;
    this.browserbot.selectWindow("null");
    this.browserbot.resetPopups();
}


/*
 * ---   Initialize Conditional Elements  --- *
 *  Run through the script collecting line numbers of all conditional elements
 *  There are three a results arrays: goto labels, while pairs and forEach pairs
 *  
 */

Selenium.prototype.initialiseLabels = function()
{
    gotoLabels = {};
    whileLabels = { ends: {}, whiles: {} };

    forEachLabels = { forends: {}, fors: {} };  // mhb:20111107

    var command_rows = [];
    var numCommands = testCase.commands.length;
    for (var i = 0; i < numCommands; ++i) {
        var x = testCase.commands[i];
        command_rows.push(x);
    }
    var whileCmds = [];
    var forEachCmds = [];
    for( var i = 0; i < command_rows.length; i++ ) {
        if (command_rows[i].type == 'command')
        switch( command_rows[i].command.toLowerCase() ) {
            case "label":
                gotoLabels[ command_rows[i].target ] = i;
                break;
            case "while":
            case "endwhile":
                whileCmds.push( [command_rows[i].command.toLowerCase(), i] )
                break;

            case "storefor":
            case "endfor":
                forEachCmds.push( [command_rows[i].command.toLowerCase(), i] )
                break;
        }
    }  
    var i = 0;
    while( whileCmds.length ) {
        if( i >= whileCmds.length ) {
            throw new Error( "non-matching while/endWhile found" );
        }
        switch( whileCmds[i][0] ) {
            case "while":
                if( ( i+1 < whileCmds.length ) && ( "endwhile" == whileCmds[i+1][0] ) ) {
                    // pair found
                    whileLabels.ends[ whileCmds[i+1][1] ] = whileCmds[i][1];
                    whileLabels.whiles[ whileCmds[i][1] ] = whileCmds[i+1][1];
                    whileCmds.splice( i, 2 );
                    i = 0;
                } else ++i;
                break;
            case "endwhile":
                ++i;
                break;
        }
    }

/*  ---- mhb: 20111107 --- begin --- */
    var idxFE = 0;
    while( forEachCmds.length ) {
        if( idxFE >= forEachCmds.length ) {
            throw new Error( "non-matching storeFor/endFor found" );
        }
        switch( forEachCmds[idxFE][0] ) {
            case "storefor":
                if( ( idxFE+1 < forEachCmds.length ) && ("endfor" == forEachCmds[idxFE+1][0]) ) {
                    // pair found
                    forEachLabels.forends[ forEachCmds[idxFE+1][1] ] = forEachCmds[idxFE][1];
                    forEachLabels.fors[ forEachCmds[idxFE][1] ] = forEachCmds[idxFE+1][1];
                    forEachCmds.splice( idxFE, 2 );
                    idxFE = 0;
                } else ++idxFE;
                break;
            case "endfor":
                ++idxFE;
                break;
        }
    }
/*

}

Selenium.prototype.continueFromRow = function( row_num )
{
    if(row_num == undefined || row_num == null || row_num < 0) {
        throw new Error( "Invalid row_num specified." );
    }
    testCase.debugContext.debugIndex = row_num;
}

// do nothing. simple label
Selenium.prototype.doLabel = function(){};

Selenium.prototype.doGotolabel = function( label )
{
    if( undefined == gotoLabels[label] ) {
        throw new Error( "Specified label '" + label + "' is not found." );
    }
    this.continueFromRow( gotoLabels[ label ] );
};

Selenium.prototype.doGoto = Selenium.prototype.doGotolabel;

Selenium.prototype.doGotoIf = function( condition, label )
{
    if( eval(condition) ) this.doGotolabel( label );
}

Selenium.prototype.doWhile = function( condition )
{
    if( !eval(condition) ) {
        var last_row = testCase.debugContext.debugIndex;
        var end_while_row = whileLabels.whiles[ last_row ];
        if( undefined == end_while_row ) throw new Error( "Corresponding 'endWhile' is not found." );
        this.continueFromRow( end_while_row );
    }
}

Selenium.prototype.doEndWhile = function()
{
    var last_row = testCase.debugContext.debugIndex;
    var while_row = whileLabels.ends[ last_row ] - 1;
    if( undefined == while_row ) throw new Error( "Corresponding 'While' is not found." );
    this.continueFromRow( while_row );
}

/* -------   ForEach looping Contributed by Martin "Hasan" Bramwell 2011/11/07  ------- */

/*
 * Note.  I'm neither a JavaScript nor a Selenium pro.
 * There are surely some nice fix-ups that a real expert would spot in a minute.
 * If you have an idea of a better way please let me know.
 * Some 'nice-to-have' ideas :
 * -- a 'For' command instead of a 'storeFor' command
 * -- nested ForEach
 * -- 
 */

	var iteratorsMap = {};
	var collectionsMap = {};

	Selenium.prototype.getFor = function( _nameCollection )
	{

		  if( eval(iteratorsMap[_nameCollection].hasNext()) ) {
				return iteratorsMap[_nameCollection].next();
			} else {
		      var last_foreach_row = testCase.debugContext.debugIndex;
		      var end_for_row = forEachLabels.fors[ last_foreach_row ];
		      if( undefined == end_for_row ) throw new Error( "Corresponding 'endFor' could not be found." );
		      this.continueFromRow( end_for_row );
		  }
/*
*/
	}

	Selenium.prototype.doEndFor = function()
	{
		  var last_foreach_row = testCase.debugContext.debugIndex;
		  var for_row = forEachLabels.forends[ last_foreach_row ] - 1;
		  if( undefined == for_row ) throw new Error( "Corresponding 'storeFor' could not be found." );
		  this.continueFromRow( for_row );
/*
*/
	}




	Selenium.prototype.doAddToCollection = function(_nameCollection, _valueToStore) {
			var initialized = true;

			if ((iteratorsMap == undefined) || (collectionsMap == undefined)) initialized = false;

			if (collectionsMap[_nameCollection] == undefined)  initialized = false;

			if (!initialized) throw new Error( "You must first call '|addCollection | " + _nameCollection + "||' in order to initialize it." );

			collectionsMap[_nameCollection].add(_valueToStore);
			iteratorsMap[_nameCollection] = collectionsMap[_nameCollection].iterator();

	};


	Selenium.prototype.doAddCollection = function(_nameCollection) {

			if (iteratorsMap == undefined) {
				iteratorsMap = new Array();
			}

			if (collectionsMap == undefined) {
				collectionsMap = new Array();
			}

			collectionsMap[_nameCollection] = new Collection(new Array());

	};

	function Iterator(_collection)
	{
		var privateCollection = _collection;
		var total = privateCollection.length;
		var cursor = 0;

		function doNext() {
			return privateCollection[cursor++];
		}

		function doHasNext() {  return  cursor < total; }
		function doRemainderCount() {  return  total - cursor; }

		this.next = doNext;
		this.hasNext = doHasNext;
		this.remainderCount = doRemainderCount;

	}


	function Collection(_collection)
	{
		var privateCollection = _collection;

		function doSize() { return  privateCollection.length; }
		this.size = doSize;

		function doIterator() {
			return new Iterator(privateCollection);
		}

		function doAdd(_value) {
			privateCollection[privateCollection.length] = _value;
		}

		this.iterator = doIterator;
		this.add = doAdd;
		
	}


