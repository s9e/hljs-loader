(function (window, document)
{
	if (window['hljsLoader'])
	{
		return;
	}

	/**
	* Generate and return a map of aliases to their canonical name
	*
	* @return {!Object<string, string>}
	*/
	function generateAliasMap()
	{
		let aliases = '1c abnf accesslog actionscript,as ada angelscript,asc apache%conf applescript,osascript arcade arduino arm!asm asciidoc,adoc aspectj autohotkey,ahk autoit avrasm awk axapta,x++ basic bnf brainfuck,bf cal capnp!roto ceylon clean,dcl,icl clojure,clj,edn clojure-repl cmake coffee!script,cson,iced coq cos,cls crm!sh,pcmk cr!ystal csp d dart delphi,dfm,dpr,pas!cal django,jinja dns,bind,zone docker!file dos,bat,cmd dsconfig dts dust,dst ebnf elixir,ex!s elm erb erl!ang erlang-repl excel,xls!x fix flix fortran,f90,f95 fs!harp,f# gams,gms gauss,gss gcode,nc gherkin,feature glsl gml golo gradle graphql,gql groovy haml handlebars,hbs,htmlbars haskell,hs haxe,hx hsp http%s hy%lang inform7,i7 irpf90 isbl jboss-cli,wildfly-cli julia julia-repl,jldoctest kotlin,kt!s lasso%script,ls latex,tex ldif leaf lisp livecodeserver livescript,ls llvm lsl mathematica,mma,wl matlab maxima mel m!ercury,moo mips!asm mizar mojolicious monkey moon!script n1ql nestedtext,nt nginx%conf nim nix%os node-repl nsis ocaml,ml openscad,scad oxygene parser3 pf pgsql,postgres!ql pony powershell,ps!1,pwsh processing,pde profile prolog properties protobuf puppet,pp purebasic,pb!i q,k!db qml,qt re!asonml rib roboconf,graph,instances routeros,mikrotik rsl ruleslanguage sas scala scheme sci!lab smali smalltalk,st sml,ml sqf sql stan%funcs stata,ado,do step!21,p21,stp styl!us subunit taggerscript tap tcl,tk thrift tp twig,craftcms vala vbs!cript vbscript-html v!erilog,sv!h vhdl vim wasm wren x86asm xl,tao xq!uery,xpath zep!hir'.replace(/(\w+)(?:%|!(\w+))/g, '$1$2,$1').split(' '),
			i       = aliases.length,
			map     = {};
		while (--i >= 0)
		{
			let aliasList = aliases[i].split(','),
				j         = aliasList.length;
			while (--j >= 0)
			{
				map[aliasList[j]] = aliasList[0];
			}
		}

		return map;
	}

	/**
	* Create and return a synchronous script element
	*
	* @param {string}    path   Path to the script, relative to the root URL and minus the .min.js suffix
	* @param {!Function} onload Callback for the "load" event
	*/
	function createScript(path, onload)
	{
		let script    = /** @type {!HTMLScriptElement} */ (document.createElement('script'));
		script.async  = false;
		script.onload = onload;
		script.src    = url + path + '.min.js';
		if (nonce)
		{
			script.nonce = nonce;
		}

		document.head.appendChild(script);
	}

	/**
	* Return the canonical language for given block (empty if no language found)
	*
	* @param  {!Element} block
	* @return {string}
	*/
	function getLangFromBlock(block)
	{
		let m = /\blang(?:uage)?-(\w+)/.exec(block.className.toLowerCase());
		if (m && !map)
		{
			// Delay generating the map until we actually need it
			map = generateAliasMap();
		}

		return (m) ? (map[m[1]] || '') : '';
	}

	/**
	* Highlight all code blocks in current document
	*/
	function highlightAll()
	{
		highlightBlocks(document.body);
	}

	/**
	* Highlight given code block
	*
	* @param {!Element} block
	*/
	function highlightBlock(block)
	{
		loadHljs();
		loadLang(getLangFromBlock(block));
		if (window['hljs'])
		{
			window['hljs']['highlightElement'](block);
		}
	}

	/**
	* Highlight all code blocks under given root node
	*
	* @param {!Node} root
	*/
	function highlightBlocks(root)
	{
		let blocks = root.querySelectorAll('pre>code:not(.hljs)'),
			i      = blocks.length;
		if (!i)
		{
			return;
		}

		observerStop();
		while (--i >= 0)
		{
			highlightBlock(blocks[i]);
		}
		observerStart();
	}

	/**
	* Load highlight.js and schedule a document-wide highlighting if not already available
	*/
	function loadHljs()
	{
		if (loaded)
		{
			return;
		}
		loaded = true;

		if (style !== 'none')
		{
			let link  = /** @type {!HTMLLinkElement} */ (document.createElement('link'));
			link.rel  = 'stylesheet';
			link.href = url + 'styles/' + style + '.min.css';
			document.head.appendChild(link);
		}
		createScript('highlight', function ()
		{
			if (options)
			{
				window['hljs']['configure'](JSON.parse(options));
			}
			highlightAll();
		});
	}

	/**
	* Load given extra language and schedule a document-wide highlighting
	*
	* @param {string} lang
	*/
	function loadLang(lang)
	{
		if (skip[lang])
		{
			return;
		}

		skip[lang] = 1;
		createScript('languages/' + lang, highlightAll);
	}

	function observerStart()
	{
		if (!observeTarget)
		{
			return;
		}

		let target = document.querySelector(observeTarget);
		if (!target)
		{
			return;
		}

		if (!observer)
		{
			observer = new MutationObserver(onMutations);
		}
		observer.observe(target, { 'childList': true, 'subtree': true });
	}

	function observerStop()
	{
		if (observer)
		{
			observer.disconnect();
		}
	}

	/**
	* @param {!Array.<!MutationRecord>} mutations
	*/
	function onMutations(mutations)
	{
		mutations.forEach(onMutation);
	}

	/**
	* @param {!MutationRecord} mutation
	*/
	function onMutation(mutation)
	{
		if (mutation.addedNodes.length)
		{
			mutation.addedNodes.forEach(handleMutationAddedNode);
		}
	}

	/**
	* @param {!Node} node
	*/
	function handleMutationAddedNode(node)
	{
		// Node.ELEMENT_NODE
		if (node.nodeType === 1)
		{
			highlightBlocks(node);
		}
	}

	function init()
	{
		highlightAll();
		observerStart();
	}

	// Initialize global variables
	let currentScript = document.currentScript,
		config        = currentScript.dataset,
		loaded        = false,
		map,
		nonce         = currentScript.nonce,
		observeTarget = config['hljsObserve'],
		observer,
		options       = config['hljsOptions'],
		skip          = {'':1},
		style         = config['hljsStyle'] || 'default',
		url           = config['hljsUrl']   || 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/';

	// Prepare to highlight all code blocks as soon as possible
	if (document.readyState === 'complete')
	{
		init();
	}
	else
	{
		window.addEventListener('load', init);
	}

	window['hljsLoader'] = {
		'disconnect':      function ()
		{
			observerStop();
			observeTarget = '';
		},
		'highlightBlocks': highlightBlocks,
		'observe':         function (target)
		{
			observeTarget = target;
			observerStart();
		}
	};
})(window, document);